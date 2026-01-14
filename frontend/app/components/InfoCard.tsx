type Props = { title: string; text: string; icon?: string };

export default function InfoCard({ title, text, icon }: Props) {
  return (
    <div className="card">
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          border: "1px solid var(--border)", display: "flex",
          alignItems: "center", justifyContent: "center", fontSize: 18
        }}>
          {icon ?? "✦"}
        </div>
        <div style={{ fontWeight: 900 }}>{title}</div>
      </div>
      <p style={{ color: "var(--muted)", lineHeight: 1.7, marginTop: 10 }}>
        {text}
      </p>
    </div>
  );
}
