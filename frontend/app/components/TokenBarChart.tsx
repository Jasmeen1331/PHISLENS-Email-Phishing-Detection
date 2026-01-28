type Item = { token: string; weight: number };

export default function TokenBarChart({ items }: { items: Item[] }) {
  const top = (items || []).slice(0, 10);
  const maxW = Math.max(...top.map((x) => Math.abs(x.weight)), 0.00001);

  return (
    <div className="card lift cardPad">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 950 }}>Token contributions</div>
        <span className="pill">Model evidence</span>
      </div>

      <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
        {top.map((it) => {
          const pct = Math.min(100, (Math.abs(it.weight) / maxW) * 100);
          return (
            <div key={it.token}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div style={{ fontWeight: 850 }}>{it.token}</div>
                <div style={{ color: "var(--muted)", fontWeight: 800 }}>
                  {it.weight.toFixed(3)}
                </div>
              </div>
              <div className="barWrap" style={{ marginTop: 6 }}>
                <div className="barFill" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 12, color: "var(--muted)", fontWeight: 650, lineHeight: 1.6 }}>
        Longer bars mean stronger influence toward the phishing prediction.
      </div>
    </div>
  );
}
