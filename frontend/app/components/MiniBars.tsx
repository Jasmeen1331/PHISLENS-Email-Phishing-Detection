type Item = { label: string; value: number };

export default function MiniBars({ title, items }: { title: string; items: Item[] }) {
  return (
    <div className="card lift">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontWeight: 950 }}>{title}</div>
        <span className="pill">XAI</span>
      </div>

      <div style={{ marginTop: 12, display:"grid", gap: 10 }}>
        {items.map((it) => {
          const pct = Math.max(0, Math.min(100, it.value * 100));
          return (
            <div key={it.label}>
              <div style={{ display:"flex", justifyContent:"space-between", color:"var(--muted)", fontWeight: 900, fontSize: 13 }}>
                <span>{it.label}</span>
                <span>{pct.toFixed(0)}%</span>
              </div>
              <div className="barWrap" style={{ marginTop: 6 }}>
                <div className="barFill" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
