"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

export default function MetricsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/model-metrics")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data)
    return (
      <div style={{ padding: 60, color: "#fff", background: "#0f172a", minHeight: "100vh" }}>
        Loading analytics...
      </div>
    );

  const m = data.test_metrics;
  const cm = m.confusion_matrix;

  const rocData = data.roc.fpr.map((fpr: number, i: number) => ({
    fpr,
    tpr: data.roc.tpr[i],
  }));

  const prData = data.precision_recall.precision.map(
    (precision: number, i: number) => ({
      recall: data.precision_recall.recall[i],
      precision,
    })
  );

  return (
    <div
      style={{
        padding: 60,
        background: "linear-gradient(135deg,#0f172a,#111827)",
        minHeight: "100vh",
        color: "#ffffff",
      }}
    >
      <div style={{ maxWidth: 1300, margin: "auto" }}>
        <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 10 }}>
          Model Performance Dashboard
        </h1>
        <p style={{ color: "#9ca3af" }}>
          Advanced evaluation metrics and analytical insights
        </p>

        {/* KPI SECTION */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 30,
            marginTop: 50,
          }}
        >
          <KPI label="Accuracy" value={m.accuracy} gradient="linear-gradient(135deg,#2563eb,#4f46e5)" />
          <KPI label="Precision" value={m.precision} gradient="linear-gradient(135deg,#059669,#10b981)" />
          <KPI label="Recall" value={m.recall} gradient="linear-gradient(135deg,#f59e0b,#f97316)" />
          <KPI label="F1 Score" value={m.f1} gradient="linear-gradient(135deg,#ec4899,#8b5cf6)" />
        </div>

        {/* CHART SECTION */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 40,
            marginTop: 80,
          }}
        >
          <GlassCard title={`ROC Curve (AUC ${data.roc.auc.toFixed(3)})`}>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={rocData}>
                <CartesianGrid stroke="#1f2937" />
                <XAxis stroke="#9ca3af" dataKey="fpr" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="tpr"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </GlassCard>

          <GlassCard title="Precision–Recall Curve">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={prData}>
                <CartesianGrid stroke="#1f2937" />
                <XAxis stroke="#9ca3af" dataKey="recall" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="precision"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>

        {/* CONFUSION MATRIX */}
        <div style={{ marginTop: 100 }}>
          <h2 style={{ marginBottom: 30 }}>Confusion Matrix</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "150px 1fr 1fr",
              gap: 20,
            }}
          >
            <div></div>
            <div style={{ color: "#9ca3af" }}>Predicted Legitimate</div>
            <div style={{ color: "#9ca3af" }}>Predicted Phishing</div>

            <div style={{ color: "#9ca3af" }}>Actual Legitimate</div>
            <HeatCell value={cm[0][0]} positive />
            <HeatCell value={cm[0][1]} negative />

            <div style={{ color: "#9ca3af" }}>Actual Phishing</div>
            <HeatCell value={cm[1][0]} negative />
            <HeatCell value={cm[1][1]} positive />
          </div>
        </div>
      </div>
    </div>
  );
}

function KPI({ label, value, gradient }: any) {
  return (
    <div
      style={{
        background: gradient,
        padding: 30,
        borderRadius: 24,
        textAlign: "center",
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
      }}
    >
      <div style={{ fontSize: 14, opacity: 0.8 }}>{label}</div>
      <div style={{ fontSize: 40, fontWeight: 900, marginTop: 10 }}>
        {(value * 100).toFixed(2)}%
      </div>
    </div>
  );
}

function GlassCard({ title, children }: any) {
  return (
    <div
      style={{
        backdropFilter: "blur(15px)",
        background: "rgba(255,255,255,0.05)",
        padding: 30,
        borderRadius: 24,
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <h3 style={{ marginBottom: 20 }}>{title}</h3>
      {children}
    </div>
  );
}

function HeatCell({ value, positive }: any) {
  return (
    <div
      style={{
        padding: 40,
        borderRadius: 20,
        textAlign: "center",
        fontSize: 28,
        fontWeight: 900,
        background: positive
          ? "linear-gradient(135deg,#065f46,#10b981)"
          : "linear-gradient(135deg,#7f1d1d,#ef4444)",
      }}
    >
      {value}
    </div>
  );
}