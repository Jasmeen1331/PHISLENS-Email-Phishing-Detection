import AvatarCard from "./components/AvatarCard";

export default function HomePage() {
  return (
    <div className="container">
      <div className="hero">
        <div className="card">
          <div className="pill">Explainable AI • Email Security</div>
          <h1 className="hTitle" style={{ marginTop: 14 }}>
            Detect phishing with <span className="glowText">evidence</span>, not guesses.
          </h1>
          <p className="hSub">
            PHISHLENS classifies emails as phishing/spam or legitimate and explains the decision using
            evidence tokens, reason categories, and highlighted suspicious text.
          </p>

          <div className="btnRow">
            <a href="/demo"><button className="button">Try Live Demo</button></a>
            <a href="/xai"><button className="buttonOutline">See Explainability</button></a>
          </div>

          <div className="section">
            <div className="badgeRow">
              {["Evidence tokens", "Reason categories", "Highlights", "Metrics"].map((t) => (
                <span key={t} className="badge">{t}</span>
              ))}
            </div>
          </div>
        </div>

        <AvatarCard
          status="idle"
          message="Hi! I’m your PHISHLENS assistant. Scroll to see how the system works, then run a detection demo. I’ll explain what signals I found."
        />
      </div>

      <div className="section grid3">
        <div className="card">
          <div className="pill">Problem</div>
          <h3 style={{ marginTop: 12 }}>Phishing looks “normal”</h3>
          <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
            Attackers mimic trusted brands and use urgency + links to trick users into clicking or sharing credentials.
          </p>
        </div>

        <div className="card">
          <div className="pill">Solution</div>
          <h3 style={{ marginTop: 12 }}>ML classification</h3>
          <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
            PHISHLENS learns patterns from real datasets to output a phishing probability for each email.
          </p>
        </div>

        <div className="card">
          <div className="pill">Uniqueness</div>
          <h3 style={{ marginTop: 12 }}>Explainability first</h3>
          <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
            Instead of only a label, PHISHLENS shows evidence, categories, and highlighted text to support trust.
          </p>
        </div>
      </div>

      <div className="section card">
        <h2 style={{ marginTop: 0 }}>How it works</h2>
        <div className="badgeRow">
          {["Input email", "Cleaning", "Vectorizer (TF-IDF)", "Classifier", "Explainability output"].map((t) => (
            <span key={t} className="badge">{t}</span>
          ))}
        </div>
        <p style={{ marginTop: 12, color: "var(--muted)", lineHeight: 1.75 }}>
          The website sends your email subject/body to the Python backend. The model returns a probability plus
          explainability data that the UI turns into an evidence dashboard.
        </p>

        <div className="btnRow">
          <a href="/metrics"><button className="buttonOutline">View Model Metrics</button></a>
          <a href="/demo"><button className="button">Run Detection</button></a>
        </div>
      </div>

      <div className="footer">
        © {new Date().getFullYear()} PHISHLENS — Dissertation artefact
      </div>
    </div>
  );
}
