import AvatarCard from "../components/AvatarCard";

export default function XaiPage() {
  return (
    <div className="container">
      <div className="hero">
        <div className="card">
          <div className="pill">Explainability</div>
          <h1 className="hTitle" style={{ marginTop: 14 }}>
            PHISHLENS explains <span className="glowText">why</span>.
          </h1>
          <p className="hSub">
            Your contribution is not just detection — it’s interpretable evidence. This supports user trust,
            decision-making, and reduces “black-box” risk.
          </p>
          <div className="badgeRow">
            {["Evidence tokens", "Reason categories", "Highlighted text", "Confidence"].map((t) => (
              <span key={t} className="badge">{t}</span>
            ))}
          </div>
        </div>

        <AvatarCard
          status="explaining"
          message="Explainability is the key gap. PHISHLENS shows both model-driven evidence and human-readable reason categories. On the demo page, the body text is highlighted so you can see exactly what triggered suspicion."
        />
      </div>

      <div className="section grid3">
        <div className="card">
          <div className="pill">1) Evidence tokens</div>
          <p style={{ color: "var(--muted)", lineHeight: 1.75 }}>
            The model returns influential words/phrases contributing to the prediction.
          </p>
        </div>
        <div className="card">
          <div className="pill">2) Reason categories</div>
          <p style={{ color: "var(--muted)", lineHeight: 1.75 }}>
            Signals are grouped into user-friendly categories like urgency, credentials, links, and threats.
          </p>
        </div>
        <div className="card">
          <div className="pill">3) Highlighted body</div>
          <p style={{ color: "var(--muted)", lineHeight: 1.75 }}>
            Suspicious phrases are highlighted directly in the email text to make the decision transparent.
          </p>
        </div>
      </div>
    </div>
  );
}
