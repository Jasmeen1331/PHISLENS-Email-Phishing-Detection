import re
import joblib
from pathlib import Path
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000"]}})

MODEL_PATH = Path(__file__).resolve().parent / "models" / "fishlens_lr_tfidf.joblib"
model = joblib.load(MODEL_PATH)

# --- Simple XAI keyword categories (easy to justify in dissertation)
REASON_RULES = {
    "Urgency / Pressure": [
        "urgent", "immediately", "asap", "act now", "right away", "limited time", "final warning"
    ],
    "Credential / Verification": [
        "password", "verify", "login", "sign in", "confirm", "credentials", "update your account"
    ],
    "Link / Action Prompt": [
        "click", "link", "open", "download", "attachment", "verify here", "reset"
    ],
    "Threat / Consequence": [
        "suspended", "locked", "disabled", "terminated", "security alert", "unauthorized", "breach"
    ],
    "Money / Payment": [
        "invoice", "payment", "bank", "refund", "transaction", "wire", "gift card"
    ]
}

def clean_text(subject: str, body: str) -> str:
    text = f"{subject or ''} {body or ''}".lower()
    text = re.sub(r"http\S+|www\.\S+", " URL ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

def find_spans(text: str, phrases: list[str], max_spans: int = 12):
    """Return list of {start,end,text} for found phrases in text (case-insensitive)."""
    spans = []
    lower = text.lower()
    for ph in phrases:
        ph_l = ph.lower()
        start = 0
        while True:
            idx = lower.find(ph_l, start)
            if idx == -1:
                break
            spans.append({"start": idx, "end": idx + len(ph), "text": text[idx: idx + len(ph)]})
            start = idx + len(ph_l)
            if len(spans) >= max_spans:
                return spans
    # sort by start, then remove overlaps
    spans.sort(key=lambda x: (x["start"], -(x["end"] - x["start"])))
    non_overlap = []
    last_end = -1
    for s in spans:
        if s["start"] >= last_end:
            non_overlap.append(s)
            last_end = s["end"]
    return non_overlap[:max_spans]

def build_reasons(subject: str, body: str):
    text = f"{subject} {body}".lower()
    reasons = []
    for cat, keys in REASON_RULES.items():
        hits = []
        for k in keys:
            if k in text:
                hits.append(k)
        if hits:
            reasons.append({"category": cat, "hits": sorted(set(hits))})
    return reasons

def make_summary(prob: float, reasons: list[dict]) -> str:
    if not reasons:
        return "PhsiLens found no strong rule-based indicators; classification is mainly based on learned patterns."
    top = [r["category"] for r in reasons[:2]]
    return f"High risk signals detected: {', '.join(top)}. Predicted phishing probability: {prob:.2f}."

@app.get("/")
def root():
    return jsonify({"message": "PhsiLens API running", "endpoints": ["/health", "/predict"]})

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
    phishing_prob = float(proba[1])
    pred = int(phishing_prob >= 0.5)

    # Explainability from linear model: top contributing features toward class 1
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
            # keep short tokens for highlight (skip 1-char junk)
            if len(token) >= 4:
                tokens_for_highlight.append(token)

    # Rule-based reasons (for user-friendly explanation)
    reasons = build_reasons(subject, body)

    # Highlight spans in the BODY (not cleaned) using rule hits + top tokens
    highlight_phrases = []
    for r in reasons:
        highlight_phrases.extend(r["hits"])
    highlight_phrases.extend(tokens_for_highlight[:6])
    highlight_phrases = list(dict.fromkeys(highlight_phrases))  # unique, keep order

    spans = find_spans(body or "", highlight_phrases, max_spans=12)

    summary = make_summary(phishing_prob, reasons)

    return jsonify({
        "label": "phishing_or_spam" if pred == 1 else "legitimate",
        "probability_phishing": phishing_prob,
        "explanations": explanations,
        "reasons": reasons,
        "highlight_spans": spans,
        "summary": summary
    })

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=True)
