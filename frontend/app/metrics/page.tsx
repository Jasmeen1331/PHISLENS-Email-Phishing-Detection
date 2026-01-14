export default function MetricsPage() {
  return (
    <div className="container">
      <div className="card">
        <div className="pill">Evaluation</div>
        <h1 className="hTitle" style={{ marginTop: 14 }}>Model Metrics</h1>
        <p className="hSub">
          In your dissertation you’ll report precision/recall/F1 and confusion matrix. This page is where you show it in the demo.
        </p>
      </div>

      <div className="section grid3">
        <div className="card">
          <div className="pill">Precision</div>
          <h2 style={{ marginTop: 12 }}>—</h2>
          <p style={{ color: "var(--muted)" }}>Add your measured value here.</p>
        </div>
        <div className="card">
          <div className="pill">Recall</div>
          <h2 style={{ marginTop: 12 }}>—</h2>
          <p style={{ color: "var(--muted)" }}>Add your measured value here.</p>
        </div>
        <div className="card">
          <div className="pill">F1-score</div>
          <h2 style={{ marginTop: 12 }}>—</h2>
          <p style={{ color: "var(--muted)" }}>Add your measured value here.</p>
        </div>
      </div>

      <div className="section card">
        <div className="pill">Confusion Matrix</div>
        <p style={{ color: "var(--muted)", lineHeight: 1.75, marginTop: 10 }}>
          Export a confusion matrix PNG from Python and place it as <b>/public/confusion_matrix.png</b>, then show it here.
        </p>
        <img
          src="/confusion_matrix.png"
          alt="Confusion matrix"
          style={{ width: "100%", marginTop: 12, borderRadius: 16, border: "1px solid rgba(255,255,255,0.14)" }}
        />
      </div>
    </div>
  );
}
