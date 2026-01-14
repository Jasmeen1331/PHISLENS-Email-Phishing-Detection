type Props = {
  status: "idle" | "thinking" | "explaining";
  message: string;
};

export default function AvatarCard({ status, message }: Props) {
  const label =
    status === "thinking" ? "Analyzing..." :
    status === "explaining" ? "Explanation" :
    "PHISHLENS Assistant";

  return (
    <div className="card section">
      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
        <img
          src="c71c3ca400f742dcedff716b2fc5962c.jpg"
          width={72}
          height={72}
          style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,0.14)" }}
        />
        
        </div>
      </div>
  );
}
