# PHISLENS: Explainable Email Phishing Detection

PHISLENS is a machine-learning based system for detecting phishing emails using their body text while providing **transparent** explanations for each prediction. The project combines traditional text classification techniques (TF–IDF, n‑grams) with a Random Forest classifier and Explainable AI (XAI) methods (SHAP, LIME) to highlight which words and phrases make an email suspicious.

---

## Features

- Supervised phishing vs. legitimate email classification using email body text.
- Text preprocessing pipeline: cleaning, normalisation, tokenisation and stopword handling.
- TF–IDF feature extraction, with optional n‑gram support for capturing phishing phrases.
- Baseline models: Naïve Bayes, Logistic Regression, Support Vector Machine.
- Primary model: Random Forest classifier optimised for phishing-email text.
- Explainability layer:
  - SHAP for stable, word-level and global feature importance.
  - LIME for local, example-specific explanations.
- Evaluation using accuracy, precision, recall, F1-score and ROC–AUC.

---

## Project Objectives

This project was developed as part of a BSc (Hons) Computer Science degree at the University of Central Lancashire. The main objectives are:

1. Build a content-focused phishing detector using email body text only.  
2. Compare several classical ML models (NB, LR, SVM, RF) for phishing detection.
3. Use TF–IDF and n‑grams to capture linguistic and structural phishing cues.
4. Integrate SHAP (and optionally LIME) to generate human-readable explanations for each prediction.
5. Evaluate performance and explanation quality in terms of transparency, robustness and practical use.

---

## Dataset

PHISLENS uses a combination of publicly available datasets:

- **Legitimate emails:** Enron email corpus (workplace communication, natural language).
- **Phishing emails:** A Kaggle phishing-email dataset rich in social-engineering content.

These datasets are preprocessed and combined into a single labelled corpus, with each email represented by its body text and a binary label (`phishing` / `legitimate`).

If you use different datasets, update the paths and expected columns (e.g. `text`, `label`) in the data-loading scripts.

---

## Methodology

The end-to-end workflow follows a supervised learning pipeline:

1. **Data loading and cleaning**  
   - Remove HTML tags, scripts, signatures and non-text artefacts.  
   - Normalise case, remove unnecessary punctuation and handle missing values.

2. **Preprocessing**  
   - Tokenise text and remove stopwords where appropriate.  
   - Optionally apply simple stemming/lemmatisation (if enabled in the notebook/script).

3. **Feature extraction**  
   - Convert text to numerical vectors using `TfidfVectorizer` (uni-grams and optional n‑grams).

4. **Model training**  
   - Train baseline models: Naïve Bayes, Logistic Regression, SVM.
   - Train and tune the main Random Forest classifier using cross-validation.

5. **Evaluation**  
   - Report accuracy, precision, recall, F1-score and ROC–AUC on held-out test data.

6. **Explainability (XAI)**  
   - Use SHAP to compute global feature importances and local word-level contributions for each email.  
   - Optionally apply LIME for comparison on selected examples.

---

## Repository Structure

```text
PHISLENS-Email-Phishing-Detection/
│
├── backend/                # Flask/FastAPI backend (if applicable)
├── frontend/               # React/Vue frontend (if applicable)
├── data/
│   ├── raw/              # Original Enron + Kaggle datasets
│   └── processed/        # Cleaned and merged CSVs
│
├── notebooks/
│   ├── 01_data_preprocessing.ipynb
│   ├── 02_feature_engineering_and_baselines.ipynb
│   ├── 03_random_forest_model.ipynb
│   └── 04_shap_explainability.ipynb
│
├── src/
│   ├── preprocessing.py      # Cleaning & preprocessing functions
│   ├── features.py           # TF–IDF / n‑gram vectorisation
│   ├── models.py             # Model training, evaluation utilities
│   └── explainability.py     # SHAP / LIME helpers
│
├── models/
│   ├── rf_model.pkl          # Trained Random Forest
│   └── tfidf_vectorizer.pkl
│
├── reports/
│   └── figures/              # SHAP plots, confusion matrices, etc.
│
├── requirements.txt
└── README.md
```

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Jasmeen1331/PHISLENS-Email-Phishing-Detection.git
cd PHISLENS-Email-Phishing-Detection
```

2. Create and activate a virtual environment (recommended):

```bash
python -m venv .venv
source .venv/bin/activate   # On Windows: .venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

---

## Usage

### 1. Prepare the data

Place your raw datasets in `data/raw/` and update any file paths in the notebooks or `src/preprocessing.py`.

Then run the preprocessing script or notebook:

```bash
python -m src.preprocessing
```

This will output a cleaned, labelled CSV into `data/processed/`.

### 2. Train models

Train baseline models and the main Random Forest classifier:

```bash
python -m src.models
```

This step will:

- Split the data into train/test sets.  
- Train NB, LR, SVM, RF models.  
- Save the trained RF model and TF–IDF vectorizer into `models/`.

### 3. Generate explanations with SHAP

Once the Random Forest and TF–IDF vectorizer are saved, run SHAP analysis:

```bash
python -m src.explainability
```

This will:

- Load the trained RF model and vectorizer.  
- Compute SHAP values on a sample of emails.  
- Produce plots and visualisations, saved into `reports/figures/`.

### 4. Predict on new emails (example)

You can also load the trained artefacts and run predictions in a Python shell:

```python
import joblib
from src.preprocessing import clean_text
from src.features import vectorize_text

model = joblib.load("models/rf_model.pkl")
vectorizer = joblib.load("models/tfidf_vectorizer.pkl")

email = "Dear user, your account has been suspended. Please click the link below to verify your details."
cleaned = clean_text(email)
X = vectorizer.transform([cleaned])

prediction = model.predict(X)[0]
proba = model.predict_proba(X)[0][1]
print(prediction, proba)
```

---

## Explainable AI (XAI) Layer

The XAI component is central to PHISLENS:

- **SHAP**  
  - Provides stable, mathematically grounded feature attributions for tree-based models.  
  - Supports both global insights (which words matter overall) and local insights (why a specific email is flagged).

- **LIME (optional)**  
  - Offers simple, local surrogate explanations for individual emails, highlighting the most influential words.

These explanations are intended to help security analysts and end‑users understand *why* an email is marked as phishing and to align with transparency expectations such as GDPR Article 22.

---

## Limitations and Future Work

Some limitations identified in the project:

- Reliance on static, pre-collected datasets rather than live organisational email streams.  
- Focus on body text only; headers, URLs and attachments are not yet integrated.
- Explanations are provided per-email but not yet evaluated in user studies with non-technical users.

Potential future extensions:

- Incorporate header, URL and metadata features alongside body text.  
- Explore deep learning models (e.g. transformers) with XAI for more complex language patterns.
- Develop a lightweight web or email-client interface for real-time detection and explanation display.

---

## Academic Context

This repository accompanies the final-year project report titled **"Email Phishing Detection Using Machine Learning"** submitted to the School of Engineering and Computing, University of Central Lancashire.

---

## License

MIT License – see LICENSE file for details.
