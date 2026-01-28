export default function Gauge({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="card lift">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontWeight: 950 }}>Risk meter</div>
        <span className="pill">{pct.toFixed(0)}%</span>
      </div>

      <div
        style={{
          marginTop: 12,
          width: 220,
          height: 220,
          borderRadius: 999,
          background: `conic-gradient(var(--brand) ${pct * 3.6}deg, rgba(255,255,255,0.10) 0deg)`,
          display: "grid",
          placeItems: "center",
          border: "1px solid rgba(255,255,255,0.14)",
        }}
      >
        <div
          style={{
            width: 170,
            height: 170,
            borderRadius: 999,
            background: "rgba(6,8,18,0.55)",
            border: "1px solid rgba(255,255,255,0.12)",
            display: "grid",
            placeItems: "center",
            textAlign: "center",
            padding: 12,
          }}
        >
          <div style={{ fontWeight: 950, fontSize: 28 }}>{pct.toFixed(0)}%</div>
          <div style={{ color: "var(--muted)", fontWeight: 850, fontSize: 13 }}>phishing probability</div>
        </div>
      </div>
    </div>
  );
}
