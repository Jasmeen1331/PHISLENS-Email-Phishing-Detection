export default function AboutPage() {
  return (
    <div className="container">
      <div className="card">
        <div className="pill">Dissertation</div>
        <h1 className="hTitle" style={{ marginTop: 14 }}>About PHISHLENS</h1>
        <p className="hSub">
          This artefact supports a final-year dissertation investigating phishing detection with a focus on explainable AI.
        </p>
      </div>

      <div className="section grid3">
        <div className="card">
          <div className="pill">Research gap</div>
          <p style={{ color: "var(--muted)", lineHeight: 1.75 }}>
            Many classifiers label emails, but few provide evidence that end users can understand.
          </p>
        </div>
        <div className="card">
          <div className="pill">Ethics & privacy</div>
          <p style={{ color: "var(--muted)", lineHeight: 1.75 }}>
            Emails may contain sensitive data. PHISHLENS should avoid storing user inputs and should run locally for demos.
          </p>
        </div>
        <div className="card">
          <div className="pill">Limitations</div>
          <p style={{ color: "var(--muted)", lineHeight: 1.75 }}>
            Adversarial wording and unseen scams can reduce performance. Future work: more datasets + stronger models.
          </p>
        </div>
      </div>
    </div>
  );
}
