type Props = {
  pct: number; // 0..100
  label: "phishing_or_spam" | "legitimate";
};

export default function SignalDonut({ pct, label }: Props) {
  const clamped = Math.max(0, Math.min(100, pct));
  const ring = `conic-gradient(var(--cyan) ${clamped * 3.6}deg, rgba(255,255,255,0.10) 0deg)`;

  return (
    <div className="card lift cardPad">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 950 }}>Risk meter</div>
        <span className="pill">{label === "phishing_or_spam" ? "High risk" : "Low risk"}</span>
      </div>

      <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "220px 1fr", gap: 16, alignItems: "center" }}>
        <div
          style={{
            width: 220,
            height: 220,
            borderRadius: 999,
            background: ring,
            border: "1px solid rgba(255,255,255,0.14)",
            display: "grid",
            placeItems: "center",
          }}
        >
          <div
            style={{
              width: 170,
              height: 170,
              borderRadius: 999,
              background: "rgba(7,10,18,0.55)",
              border: "1px solid rgba(255,255,255,0.12)",
              display: "grid",
              placeItems: "center",
              textAlign: "center",
              padding: 12,
            }}
          >
            <div style={{ fontWeight: 950, fontSize: 30 }}>{clamped.toFixed(0)}%</div>
            <div style={{ color: "var(--muted)", fontWeight: 800, fontSize: 13 }}>
              phishing probability
            </div>
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 950, fontSize: 18 }}>
            {label === "phishing_or_spam" ? (
              <span className="bad">⚠️ Likely phishing</span>
            ) : (
              <span className="good">✅ Likely legitimate</span>
            )}
          </div>
          <div style={{ marginTop: 10, color: "var(--muted)", fontWeight: 650, lineHeight: 1.7 }}>
            Visual summary of the model’s confidence.
          </div>
        </div>
      </div>
    </div>
  );
}
