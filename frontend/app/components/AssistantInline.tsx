export default function AssistantInline({
  state,
  title,
  message,
}: {
  state: "thinking" | "explaining";
  title: string;
  message: string;
}) {
  const badge = state === "thinking" ? "Analyzing" : "Explaining";
  return (
    <div className="card lift" style={{ padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 950 }}>{title}</div>
        <span className="pill">● {badge}</span>
      </div>

      <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "80px 1fr", gap: 12 }}>
        <div style={{
          width: 80, height: 80, borderRadius: 18,
          border: "1px solid rgba(255,255,255,0.14)",
          background: "linear-gradient(135deg, rgba(34,211,238,0.22), rgba(167,139,250,0.18))",
          display: "grid", placeItems: "center", fontWeight: 950
        }}>
          AI
        </div>

        <div style={{ color: "var(--muted)", fontWeight: 700, lineHeight: 1.6 }}>
          <b style={{ color: "var(--text)" }}>About me:</b> I translate the model’s decision into visual evidence.
          I show <b style={{ color: "var(--text)" }}>risk</b>, <b style={{ color: "var(--text)" }}>why</b>,
          and <b style={{ color: "var(--text)" }}>what to do next</b>.
        </div>
      </div>

      <div style={{ marginTop: 12, fontWeight: 800, lineHeight: 1.6 }}>
        {message}
      </div>
    </div>
  );
}
