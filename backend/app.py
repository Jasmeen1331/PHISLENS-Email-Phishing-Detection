import re
import joblib
from pathlib import Path
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000"]}})
import json
METRICS_PATH = Path(__file__).resolve().parent / "models" / "metrics.json"
THRESHOLD = 0.5
if METRICS_PATH.exists():
    THRESHOLD = float(json.loads(METRICS_PATH.read_text()).get("threshold", 0.5))

MODEL_PATH = Path(__file__).resolve().parent / "models" / "fishlens_lr_tfidf.joblib"
model = joblib.load(MODEL_PATH)

REASON_RULES = {
    "Urgency / Pressure": ["urgent", "immediately", "asap", "act now", "right away", "final warning"],
    "Credential / Verification": ["password", "verify", "login", "sign in", "confirm", "credentials", "update your account"],
    "Link / Action Prompt": ["click", "link", "download", "attachment", "reset", "open"],
    "Threat / Consequence": ["suspended", "locked", "disabled", "terminated", "security alert", "unauthorized", "breach"],
    "Money / Payment": ["invoice", "payment", "bank", "refund", "transaction", "wire", "gift card"]
}

def clean_text(subject: str, body: str) -> str:
    text = f"{subject or ''} {body or ''}".lower()
    text = re.sub(r"http\S+|www\.\S+", " URL ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

def build_reasons(subject: str, body: str):
    t = f"{subject} {body}".lower()
    reasons = []
    for cat, keys in REASON_RULES.items():
        hits = [k for k in keys if k in t]
        if hits:
            reasons.append({"category": cat, "hits": sorted(set(hits))})
    return reasons

def find_spans(text: str, phrases: list[str], max_spans: int = 12):
    spans = []
    low = (text or "").lower()
    for ph in phrases:
        ph_l = ph.lower()
        start = 0
        while True:
            idx = low.find(ph_l, start)
            if idx == -1:
                break
            spans.append({"start": idx, "end": idx + len(ph), "text": text[idx:idx+len(ph)]})
            start = idx + len(ph_l)
            if len(spans) >= max_spans:
                break
    spans.sort(key=lambda x: x["start"])
    non = []
    last_end = -1
    for s in spans:
        if s["start"] >= last_end:
            non.append(s)
            last_end = s["end"]
    return non[:max_spans]

def make_summary(prob: float, reasons: list[dict]) -> str:
    if not reasons:
        return f"I didn’t find strong rule-based signals. Phishing probability: {prob:.2f}."
    cats = [r["category"] for r in reasons[:2]]
    return f"I detected {', '.join(cats)} signals. Phishing probability: {prob:.2f}."

CATEGORY_KEYWORDS = {
    "Urgency": ["urgent", "immediately", "asap", "act now", "right away", "final", "warning", "limited", "expires", "today"],
    "Credentials": ["password", "verify", "login", "sign in", "confirm", "credentials", "account", "update", "security"],
    "Links": ["click", "link", "open", "download", "attachment", "reset", "url"],
    "Threats": ["suspended", "locked", "disabled", "terminated", "unauthorized", "breach", "alert", "risk"],
    "Money": ["invoice", "payment", "bank", "refund", "transaction", "wire", "gift", "card"]
}

def risk_breakdown_from_model(feature_names, contrib):
    
    # Only consider positive contributions toward phishing
    pos = [(feature_names[i], float(contrib[i])) for i in range(len(feature_names)) if contrib[i] > 0]
    if not pos:
        return {"Urgency": 0.10, "Credentials": 0.10, "Links": 0.10, "Threats": 0.10, "Money": 0.10}

    # Sum contribution per category (match keywords against token string)
    scores = {k: 0.0 for k in CATEGORY_KEYWORDS.keys()}
    total = 0.0

    for tok, w in pos:
        total += w
        tok_l = tok.lower()
        for cat, keys in CATEGORY_KEYWORDS.items():
            if any(k in tok_l for k in keys):
                scores[cat] += w

    # Normalize and add a small floor so bars never look empty
    # (still truthful: floor is tiny)
    floor = 0.05
    if total <= 0:
        return {k: 0.10 for k in scores.keys()}

    out = {}
    for k, v in scores.items():
        out[k] = max(floor, min(1.0, v / total))
    return out


def next_steps(prob: float, label: str):
    # Simple product-like advice
    if label == "legitimate" and prob < 0.35:
        return [
            "This looks low risk. Still confirm the sender address if you weren’t expecting the email.",
            "Avoid clicking links if the message feels unusual; go directly to the official website instead.",
            "If unsure, forward to your IT/security contact for verification."
        ]
    if prob < 0.60:
        return [
            "Medium risk: verify sender address and domain carefully.",
            "Do not click links—navigate to the official site manually.",
            "Check for urgency language and unexpected requests for information."
        ]
    return [
        "High risk: do NOT click links or open attachments.",
        "Verify the sender using a separate trusted channel (phone/official website).",
        "Report the email as phishing and delete it from your inbox."
    ]
@app.get("/model-metrics")
def model_metrics():
    # Replace these with YOUR measured values (from classification_report)
    return jsonify({
        "dataset": "CEAS_08",
        "model": "TF-IDF + Logistic Regression",
        "metrics": {
            "accuracy": 0.94,
            "precision": 0.93,
            "recall": 0.92,
            "f1": 0.92
        }
    })

@app.get("/")
def root():
    return jsonify({"message": "PHISHLENS API running", "endpoints": ["/health", "/predict"]})

@app.get("/health")
def health():
    return jsonify({"status": "ok", "model_loaded": True})

@app.post("/predict")
def predict():
    data = request.get_json(force=True) or {}
    subject = data.get("subject", "")
    body = data.get("body", "")

    text = clean_text(subject, body)
    proba = model.predict_proba([text])[0]
   
    clf = model.named_steps["clf"]
    classes = list(getattr(clf, "classes_", []))
    phish_idx = classes.index(1) if 1 in classes else 1

    phishing_prob = float(proba[phish_idx])
    pred = int(phishing_prob >= THRESHOLD)

    # linear explainability (top tokens)
    tfidf = model.named_steps["tfidf"]
    clf = model.named_steps["clf"]
    feature_names = tfidf.get_feature_names_out()

    vec = tfidf.transform([text]).toarray()[0]
    weights = clf.coef_[0]
    contrib = vec * weights

    top_idx = contrib.argsort()[-10:][::-1]
    explanations = []
    tokens_for_highlight = []
    for i in top_idx:
        if vec[i] > 0:
            token = feature_names[i]
            explanations.append({"token": token, "weight": float(contrib[i])})
            if len(token) >= 4:
                tokens_for_highlight.append(token)

    reasons = build_reasons(subject, body)
    risk = risk_breakdown_from_model(feature_names, contrib)


    highlight_phrases = []
    for r in reasons:
        highlight_phrases.extend(r["hits"])
    highlight_phrases.extend(tokens_for_highlight[:6])
    highlight_phrases = list(dict.fromkeys(highlight_phrases))

    spans = find_spans(body or "", highlight_phrases, max_spans=12)

    label = "phishing_or_spam" if pred == 1 else "legitimate"
    summary = make_summary(phishing_prob, reasons)
    advice = next_steps(phishing_prob, label)

    return jsonify({
        "label": label,
        "probability_phishing": phishing_prob,
        "explanations": explanations,
        "reasons": reasons,
        "risk_breakdown": risk,
        "highlight_spans": spans,
        "summary": summary,
        "next_steps": advice,
        "assistant_profile": {
            "name": "Lensa",
            "pronouns": "she/her",
            "role": "PHISHLENS Assistant"
        }
    })

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=True)
