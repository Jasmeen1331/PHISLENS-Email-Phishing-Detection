"use client";

import { useEffect, useState } from "react";

type TestMetrics = {
  accuracy?: number;
  precision?: number;
  recall?: number;
  f1?: number;
  confusion_matrix?: number[][];
};

type Resp = {
  dataset?: string;
  model?: string;
  threshold?: number;
  test_metrics?: TestMetrics;
};

function KpiCard({ title, value }: { title: string; value?: number }) {
  return (
    <div className="card lift cardPad" style={{ textAlign: "center" }}>
      <div style={{ fontSize: 14, color: "var(--muted)" }}>{title}</div>
      <div style={{ fontSize: 34, fontWeight: 900, marginTop: 10 }}>
        {typeof value === "number"
          ? `${(value * 100).toFixed(2)}%`
          : "—"}
      </div>
    </div>
  );
}

export default function MetricsPage() {
  const [data, setData] = useState<Resp | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/model-metrics")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) return <div className="container">Loading...</div>;

  const m = data.test_metrics || {};
  const cm = m.confusion_matrix;

  return (
    <div className="container">

      {/* MODEL SUMMARY */}
      <div className="section card lift cardPad">
        <h2>Model Evaluation Summary</h2>
        <p style={{ color: "var(--muted)" }}>
          <b>Model:</b> {data.model} <br />
          <b>Dataset:</b> {data.dataset} <br />
          <b>Threshold:</b> {data.threshold?.toFixed(4)}
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="section grid3">
        <KpiCard title="Accuracy" value={m.accuracy} />
        <KpiCard title="Precision" value={m.precision} />
        <KpiCard title="Recall" value={m.recall} />
      </div>

      <div className="section grid2">
        <KpiCard title="F1 Score" value={m.f1} />
      </div>

      {/* GRAPH IMAGE */}
      <div className="section card lift cardPad">
        <h3>Performance Overview</h3>
        <img
          src="http://127.0.0.1:8000/static/metrics_bar.png"
          alt="Metrics Chart"
          style={{ width: "100%", marginTop: 20, borderRadius: 12 }}
        />
      </div>

      {/* CONFUSION MATRIX */}
      {cm && (
        <div className="section card lift cardPad">
          <h3>Confusion Matrix</h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 16,
              marginTop: 20,
            }}
          >
            <div className="matrixBox">
              {cm[0][0]}
              <br />
              True Negative
            </div>

            <div className="matrixBox">
              {cm[0][1]}
              <br />
              False Positive
            </div>

            <div className="matrixBox">
              {cm[1][0]}
              <br />
              False Negative
            </div>

            <div className="matrixBox">
              {cm[1][1]}
              <br />
              True Positive
            </div>
          </div>
        </div>
      )}

      <div className="footer">
        PHISHLENS • Evaluation & Validation
      </div>
    </div>
  );
}