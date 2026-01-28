type Props = {
  title?: string;
  message: string;
  status?: "idle" | "thinking" | "explaining";
};

export default function AvatarCard({ title, message, status = "idle" }: Props) {
  const pill = status === "thinking" ? "Analyzing…" : status === "explaining" ? "Explanation" : "Assistant";

  return (
    <div className="card lift">
      <div className="cardHeader">
        <div style={{ fontWeight: 900 }}>{title ?? "PHISHLENS Assistant"}</div>
        <span className="pill">● {pill}</span>
      </div>

      <img
  src="avatar.jpg"
  alt="PHISHLENS avatar"
  style={{
    width: 140,
    height: 140,
    borderRadius: 18,
    objectFit: "cover",
    border: "1px solid rgba(255,255,255,0.18)",
    boxShadow: "0 0 30px rgba(34,211,238,0.18)",
    background: "rgba(255,255,255,0.06)",
    display: "block"
  }}
/>

      </div>

  );
}
