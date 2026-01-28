import re
import json
import joblib
import numpy as np
import pandas as pd
from pathlib import Path

from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_predict
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    precision_recall_curve,
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
)

ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "data" / "CEAS_08.csv"
MODEL_DIR = Path(__file__).resolve().parent / "models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)

OUT_MODEL = MODEL_DIR / "phishlens_lr_tfidf.joblib"
OUT_METRICS = MODEL_DIR / "metrics.json"

def clean_text(s: str) -> str:
    if not isinstance(s, str):
        return ""
    s = s.lower()

    # Cut off common legitimate-email disclaimer tails (reduces false positives)
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

def map_label(x) -> int:
    
    x = str(x).strip().lower()
    legit = {"legit", "legitimate", "ham", "0", "false", "not phishing", "normal"}
    return 0 if x in legit else 1

def pick_threshold_for_precision(y_true, probs, target_precision=0.92):
    """
    Choose the smallest threshold that achieves target precision for class 1 (phishing).
    This reduces false positives (legit wrongly flagged).
    """
    prec, rec, thr = precision_recall_curve(y_true, probs)
    thr = np.append(thr, 1.0)

    best = 0.5
    for p, t in zip(prec, thr):
        if p >= target_precision:
            best = float(t)
            break
    return best

def eval_at_threshold(y_true, probs, thr):
    y_pred = (probs >= thr).astype(int)
    return {
        "threshold": float(thr),
        "accuracy": float(accuracy_score(y_true, y_pred)),
        "precision": float(precision_score(y_true, y_pred, zero_division=0)),
        "recall": float(recall_score(y_true, y_pred, zero_division=0)),
        "f1": float(f1_score(y_true, y_pred, zero_division=0)),
        "confusion_matrix": confusion_matrix(y_true, y_pred).tolist(),
        "report": classification_report(y_true, y_pred, digits=4, zero_division=0),
    }

def main():
    df = pd.read_csv(DATA_PATH)

    required = {"subject", "body", "label"}
    if not required.issubset(df.columns):
        raise ValueError(f"Expected columns {required}, but found {set(df.columns)}")

    df["text"] = (df["subject"].fillna("") + " " + df["body"].fillna("")).apply(clean_text)
    df["y"] = df["label"].apply(map_label)

    X = df["text"].values
    y = df["y"].values

    print("Mapped label distribution:", dict(pd.Series(y).value_counts()))
    print("Example original labels for y=0 (legit):", df[df["y"] == 0]["label"].head(5).tolist())
    print("Example original labels for y=1 (phish):", df[df["y"] == 1]["label"].head(5).tolist())

    # Hold-out test set (never used for threshold tuning)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    # Strong TF-IDF settings for email text
    tfidf = TfidfVectorizer(
        stop_words="english",
        ngram_range=(1, 2),
        max_features=120000,
        min_df=2,
        sublinear_tf=True
    )

    # Logistic Regression with strong regularization balance
    model = Pipeline([
        ("tfidf", tfidf),
        ("clf", LogisticRegression(
            max_iter=6000,
            class_weight="balanced",
            C=4.0,
            solver="liblinear"
        ))
    ])

    # Cross-validated probabilities for threshold selection
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    probs_cv = cross_val_predict(model, X_train, y_train, cv=cv, method="predict_proba")[:, 1]

    thr = pick_threshold_for_precision(y_train, probs_cv, target_precision=0.92)
    cv_metrics = eval_at_threshold(y_train, probs_cv, thr)

    print("\n=== CV (train only) metrics @threshold ===")
    print({k: cv_metrics[k] for k in ["threshold", "accuracy", "precision", "recall", "f1"]})

    # Fit final model on full training set
    model.fit(X_train, y_train)

    # Evaluate on hold-out test with SAME threshold
    probs_test = model.predict_proba(X_test)[:, 1]
    test_metrics = eval_at_threshold(y_test, probs_test, thr)

    print("\n=== HOLD-OUT TEST METRICS ===")
    print(test_metrics["report"])
    print("Confusion matrix:", test_metrics["confusion_matrix"])
    print("Threshold used:", thr)

    joblib.dump(model, OUT_MODEL)

    artifact = {
        "dataset": "CEAS_08",
        "model": "TF-IDF + Logistic Regression",
        "split": {"train": 0.80, "test": 0.20},
        "cv": {"folds": 5, "threshold_target_precision": 0.92},
        "threshold": thr,
        "test_metrics": {
            "accuracy": test_metrics["accuracy"],
            "precision": test_metrics["precision"],
            "recall": test_metrics["recall"],
            "f1": test_metrics["f1"],
            "confusion_matrix": test_metrics["confusion_matrix"],
        }
    }

    OUT_METRICS.write_text(json.dumps(artifact, indent=2))
    print("\nSaved model:", OUT_MODEL)
    print("Saved metrics:", OUT_METRICS)

if __name__ == "__main__":
    main()
