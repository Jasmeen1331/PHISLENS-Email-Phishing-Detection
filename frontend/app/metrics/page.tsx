"use client";

import { useEffect, useState } from "react";

type Resp = {
  dataset: string;
  model: string;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1: number;
  };
};

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <div className="card lift cardPad">
      <span className="pill">{label}</span>
      <div style={{ marginTop: 12, fontWeight: 950, fontSize: 34 }}>
        {(value * 100).toFixed(1)}%
      </div>
      <div style={{ marginTop: 8, color: "var(--muted)", fontWeight: 650 }}>
        from held-out test split
      </div>
    </div>
  );
}

export default function MetricsPage() {
  const [data, setData] = useState<Resp | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/model-metrics")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);

  return (
    <div className="container">
      <div className="card lift cardPad">
        <span className="pill">Model evaluation</span>
        <div style={{ fontWeight: 950, fontSize: 34, marginTop: 10 }}>
          Metrics (training performance)
        </div>
        <div
          style={{
            color: "var(--muted)",
            fontWeight: 650,
            marginTop: 10,
            lineHeight: 1.7,
          }}
        >
          {data
            ? `${data.model} • Dataset: ${data.dataset}`
            : "Loading values from backend…"}
        </div>
      </div>

      <div className="section grid3">
        <Kpi label="Accuracy" value={data?.metrics.accuracy ?? 0} />
        <Kpi label="Precision" value={data?.metrics.precision ?? 0} />
        <Kpi label="Recall" value={data?.metrics.recall ?? 0} />
      </div>

      <div className="section grid2">
        <Kpi label="F1-score" value={data?.metrics.f1 ?? 0} />

       

      </div>

      <div className="section card lift cardPad">
        <span className="pill">Why these metrics matter</span>
        <div
          style={{
            marginTop: 10,
            color: "var(--muted)",
            fontWeight: 650,
            lineHeight: 1.8,
          }}
        >
          <b style={{ color: "var(--text)" }}>Precision</b> reduces false alarms.{" "}
          <b style={{ color: "var(--text)" }}>Recall</b> reduces missed phishing.{" "}
          <b style={{ color: "var(--text)" }}>F1</b> balances both.
        </div>
      </div>

      <div className="footer">PHISHLENS • Metrics and evaluation</div>
    </div>
  );
}
