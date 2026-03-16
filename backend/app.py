from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import os
import re
import json
import joblib

# FastAPI Initialisation
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "phishlens_lr_tfidf.joblib")
METRICS_PATH = os.path.join(BASE_DIR, "models", "metrics.json")

# Load saved pipeline and metrics (trained by train_model.py for email phishing)
pipeline = None
metrics = {}

def clean_text(s: str) -> str:
    """Same cleaning as train_model.py for consistent email phishing detection."""
    if not isinstance(s, str):
        return ""
    s = s.lower()
    markers = [
        "confidentiality notice",
        "this email and any attachments",
        "unsubscribe",
        "do not reply",
        "please consider the environment",
    ]
    for m in markers:
        idx = s.find(m)
        if idx != -1:
            s = s[:idx]
    s = re.sub(r"http\S+|www\.\S+", " URL ", s)
    s = re.sub(r"\b[\w\.-]+@[\w\.-]+\.\w+\b", " EMAIL ", s)
    s = re.sub(r"\b\d{2,}\b", " NUM ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s

@app.on_event("startup")
def startup_event():
    global pipeline, metrics
    if os.path.isfile(MODEL_PATH):
        pipeline = joblib.load(MODEL_PATH)
        print("Loaded email phishing model:", MODEL_PATH)
    else:
        print("WARNING: Model not found. Run: python backend/train_model.py")
    if os.path.isfile(METRICS_PATH):
        with open(METRICS_PATH) as f:
            metrics = json.load(f)
        print("Loaded metrics (threshold = {})".format(metrics.get("threshold")))

# Request Schema
class EmailInput(BaseModel):
    subject: str = ""
    body: str = ""

# Helper Functions
def get_risk_band(prob: float) -> str:
    if prob >= 0.8:
        return "High Risk"
    if prob >= 0.6:
        return "Suspicious"
    if prob >= 0.3:
        return "Caution"
    return "Low Risk"

def get_confidence(prob: float) -> float:
    return round(abs(prob - 0.5) * 2, 3)

def get_next_steps(label: str, prob: float) -> list:
    if label == "phishing_or_spam" or prob >= 0.5:
        return [
            "Do not click any links or open attachments.",
            "Do not reply or provide personal or financial details.",
            "Report the email to your IT or security team and delete it.",
        ]
    return [
        "No strong phishing signals detected; still verify sender if unsure.",
        "Keep an eye out for follow-up messages asking for sensitive data.",
    ]

# Model Metrics Endpoint
@app.get("/model-metrics")
def get_metrics():
    if not metrics:
        return {"dataset": "CEAS_08", "model": "TF-IDF + Logistic Regression", "test_metrics": {}, "threshold": 0.5}
    return {
        "dataset": metrics.get("dataset", "CEAS_08"),
        "model": metrics.get("model", "TF-IDF + Logistic Regression"),
        "threshold": metrics.get("threshold", 0.5),
        "test_metrics": metrics.get("test_metrics", {}),
        "roc_auc": metrics.get("test_metrics", {}).get("roc_auc"),
    }

# Email Phishing Prediction Endpoint
@app.post("/predict")
def predict_email(email: EmailInput):
    if pipeline is None:
        return {
            "label": "legitimate",
            "probability_phishing": 0.0,
            "risk_band": "Unknown",
            "confidence_score": 0.0,
            "error": "Model not loaded. Run: python backend/train_model.py",
        }
    text = (email.subject or "") + " " + (email.body or "")
    text_clean = clean_text(text)
    prob = float(pipeline.predict_proba([text_clean])[0][1])
    threshold = metrics.get("threshold", 0.5)
    risk_band = get_risk_band(prob)
    confidence_score = get_confidence(prob)
    label = "phishing_or_spam" if prob >= threshold else "legitimate"
    next_steps = get_next_steps(label, prob)
    return {
        "label": label,
        "probability_phishing": prob,
        "risk_band": risk_band,
        "confidence_score": confidence_score,
        "next_steps": next_steps,
        "explanations": [],
        "reasons": [],
        "risk_breakdown": {"text_content": prob, "urgency": prob * 0.8},
        "highlight_spans": [],
        "summary": f"Email classified as {label.replace('_', ' ')} ({risk_band}).",
    }

# Root Endpoint
@app.get("/")
def root():
    return {"message": "PHISHLENS API running", "service": "Email Phishing Detection"}