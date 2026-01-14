import re
import joblib
import pandas as pd
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report

ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "data" / "CEAS_08.csv"
MODEL_DIR = Path(__file__).resolve().parent / "models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)

def clean_text(s: str) -> str:
    if not isinstance(s, str):
        return ""
    s = s.lower()
    s = re.sub(r"http\S+|www\.\S+", " URL ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s

def main():
    df = pd.read_csv(DATA_PATH)

    # Expected columns in CEAS_08: subject, body, label
    required = {"subject", "body", "label"}
    if not required.issubset(df.columns):
        raise ValueError(f"Expected columns {required}, but found {set(df.columns)}")

    df["text"] = (df["subject"].fillna("") + " " + df["body"].fillna("")).apply(clean_text)

    X = df["text"]
    y = df["label"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model = Pipeline([
        ("tfidf", TfidfVectorizer(
            stop_words="english",
            ngram_range=(1, 2),
            max_features=50000
        )),
        ("clf", LogisticRegression(
            max_iter=2000,
            class_weight="balanced"
        ))
    ])

    model.fit(X_train, y_train)
    preds = model.predict(X_test)

    print("\n=== Classification Report ===")
    print(classification_report(y_test, preds, digits=4))

    out_path = MODEL_DIR / "fishlens_lr_tfidf.joblib"
    joblib.dump(model, out_path)
    print(f"\nSaved model to: {out_path}")

if __name__ == "__main__":
    main()
