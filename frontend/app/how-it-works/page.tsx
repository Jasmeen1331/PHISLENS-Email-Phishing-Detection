export default function HowItWorksPage() {
  return (
    <div className="container">
      <div className="nav">
        <h2>PhsiLens</h2>
        <div className="links">
          <a href="/">Home</a>
          <a href="/demo">Demo</a>
          <a href="/xai">Explainability</a>
        </div>
      </div>

      <div className="card">
        <h1 style={{ marginTop: 0 }}>How PhsiLens Works</h1>
        <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
          PhsiLens is a client–server system. The website collects email text and sends it to a Python Flask API.
          The API uses a trained ML model to classify and return explainability evidence.
        </p>
      </div>

      <div className="hero section" style={{ padding: 0 }}>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Pipeline</h3>
          <div className="badgeRow">
            {["Input email", "Cleaning", "TF-IDF Vectorizer", "Classifier", "Explainability output"].map((t) => (
              <span key={t} className="badge">{t}</span>
            ))}
          </div>
          <p style={{ color: "var(--muted)", lineHeight: 1.7, marginTop: 10 }}>
            TF-IDF converts text to numerical features. Logistic Regression predicts phishing probability.
            Explainability is derived from feature contributions and user-friendly reason categories.
          </p>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>API endpoints</h3>
          <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
            <b>/health</b> — checks the model is loaded<br/>
            <b>/predict</b> — returns label, probability, reasons, highlights, evidence tokens
          </p>
        </div>
      </div>
    </div>
  );
}
