"use client";

export default function AssistantDock({
  state,
  message,
}: {
  state: "idle" | "thinking" | "explaining";
  message: string;
}) {
  const badge =
    state === "thinking" ? "Analyzing" : state === "explaining" ? "Explaining" : "Ready";

  return (
    <div className="dock">
      <div className="card lift" style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <div style={{ fontWeight: 950 }}>Lensa</div>
          <span className="pill">● {badge}</span>
        </div>

        <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "80px 1fr", gap: 12 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 18,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "linear-gradient(135deg, rgba(34,211,238,0.20), rgba(167,139,250,0.18))",
              display: "grid",
              placeItems: "center",
              fontWeight: 950,
            }}
          >
            AI
          </div>

          <div style={{ color: "var(--muted)", fontWeight: 700, lineHeight: 1.55 }}>
            <b style={{ color: "var(--text)" }}>About me:</b> I’m PHISHLENS’ explainability guide. I translate the model’s
            decision into <b style={{ color: "var(--text)" }}>visual evidence</b>: risk meter, risk breakdown, token evidence,
            and highlights.
          </div>
        </div>

        <div style={{ marginTop: 10, color: "var(--text)", fontWeight: 800, lineHeight: 1.6 }}>
          {message}
        </div>
      </div>
    </div>
  );
}
