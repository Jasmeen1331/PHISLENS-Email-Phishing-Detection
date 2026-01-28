"use client";

import { useMemo, useState } from "react";
import MiniBars from "../components/MiniBars";
import TokenBarChart from "../components/TokenBarChart";
import SignalDonut from "../components/SingleDonut";

type Explain = { token: string; weight: number };
type Reason = { category: string; hits: string[] };
type Span = { start: number; end: number; text: string };

type ApiResp = {
  label: "phishing_or_spam" | "legitimate";
  probability_phishing: number;
  explanations: Explain[];
  reasons: Reason[];
  risk_breakdown: Record<string, number>;
  highlight_spans: Span[];
  summary: string;
  next_steps: string[];
};

function highlightBody(body: string, spans: Span[]) {
  if (!body) return <span className="pre"></span>;
  if (!spans?.length) return <span className="pre">{body}</span>;
  const sorted = [...spans].sort((a, b) => a.start - b.start);
  const parts: any[] = [];
  let cursor = 0;
  for (let i = 0; i < sorted.length; i++) {
    const s = sorted[i];
    if (s.start > cursor) parts.push(body.slice(cursor, s.start));
    parts.push(<mark key={`${s.start}-${s.end}-${i}`}>{body.slice(s.start, s.end)}</mark>);
    cursor = s.end;
  }
  if (cursor < body.length) parts.push(body.slice(cursor));
  return <span className="pre">{parts}</span>;
}

export default function DemoPage() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResp | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pct = useMemo(() => (result ? Math.max(0, Math.min(100, result.probability_phishing * 100)) : 0), [result]);

  const riskItems = useMemo(() => {
    if (!result?.risk_breakdown) return [];
    return Object.entries(result.risk_breakdown).map(([label, value]) => ({ label, value }));
  }, [result]);

  const highlightCount = useMemo(() => (result?.highlight_spans?.length ?? 0), [result]);

  async function analyze() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body }),
      });
      if (!res.ok) throw new Error(await res.text());
      setResult((await res.json()) as ApiResp);
    } catch (e: any) {
      setError(e?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  }

  function loadPhishing() {
    setSubject("Urgent: Verify your account now");
    setBody("Your account will be suspended. Click this link to verify your password immediately.");
  }
  function loadLegit() {
    setSubject("Meeting agenda for tomorrow");
    setBody("Hi team, attached is the agenda for tomorrow’s meeting. Please review before 10am.");
  }
  function clearAll() {
    setSubject(""); setBody(""); setResult(null); setError(null);
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="card lift cardPad">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
          <div>
            <span className="pill">PHISHLENS • Explainable Dashboard</span>
            <div style={{ fontWeight: 950, fontSize: 30, marginTop: 10 }}>Email analysis</div>
            <div style={{ color: "var(--muted)", fontWeight: 650, marginTop: 6 }}>
              Visual evidence: probability → risk breakdown → token contributions → highlighted phrases.
            </div>
          </div>

          <div className="btnRow" style={{ marginTop: 0 }}>
            <button className="btnGhost" onClick={loadPhishing}>Load phishing</button>
            <button className="btnGhost" onClick={loadLegit}>Load legit</button>
            <button className="btnGhost" onClick={clearAll}>Clear</button>
            <button className="btn" onClick={analyze} disabled={loading}>
              {loading ? "Analyzing…" : "Analyze"}
            </button>
          </div>
        </div>

        {/* Lensa = one line narrator */}
        <div style={{
          marginTop: 14,
          padding: 12,
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.04)",
          color: "var(--muted)",
          fontWeight: 700
        }}>
          {loading
            ? "Lensa: Analyzing email… computing risk breakdown and extracting evidence highlights."
            : result
            ? `Lensa: ${result.summary}`
            : "Lensa: Paste an email or load an example, then click Analyze to generate the explainability dashboard."}
        </div>

        {error && <div style={{ marginTop: 12, color: "var(--pink)", fontWeight: 950 }}>{error}</div>}
      </div>

      {/* Workspace */}
      <div className="section demoGrid">
        {/* Input */}
        <div className="card lift cardPad">
          <span className="pill">Input</span>
          <label>Subject</label>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} />

          <label>Body</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} />
          <div className="badges" style={{ marginTop: 14 }}>
            {["Real-time", "No DB", "Explainable output"].map((t) => (
              <span className="badge" key={t}>{t}</span>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="card lift cardPad">
          <span className="pill">Decision summary</span>

          {!result ? (
            <div style={{ marginTop: 14, color: "var(--muted)", fontWeight: 650, lineHeight: 1.7 }}>
              Run analysis to populate the dashboard.
            </div>
          ) : (
            <div className="dashboardRow" style={{ marginTop: 14 }}>
              <div className="card" style={{ padding: 14 }}>
                <span className="pill">Probability</span>
                <div style={{ marginTop: 10, fontWeight: 950, fontSize: 26 }}>{pct.toFixed(0)}%</div>
                <div className="barWrap" style={{ marginTop: 10 }}>
                  <div className="barFill" style={{ width: `${pct}%` }} />
                </div>
              </div>

              <div className="card" style={{ padding: 14 }}>
                <span className="pill">Label</span>
                <div style={{ marginTop: 10, fontWeight: 950, fontSize: 18 }}>
                  {result.label === "phishing_or_spam" ? <span className="bad">High risk</span> : <span className="good">Low risk</span>}
                </div>
                <div style={{ marginTop: 10, color: "var(--muted)", fontWeight: 650 }}>
                  Based on model confidence + evidence.
                </div>
              </div>

              <div className="card" style={{ padding: 14 }}>
                <span className="pill">Highlights</span>
                <div style={{ marginTop: 10, fontWeight: 950, fontSize: 26 }}>{highlightCount}</div>
                <div style={{ marginTop: 6, color: "var(--muted)", fontWeight: 650 }}>
                  suspicious spans
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Evidence dashboard */}
      {result && (
        <>
          <div className="section grid2">
            <SignalDonut pct={pct} label={result.label} />
            <MiniBars title="Risk breakdown (tactics)" items={riskItems} />
          </div>

          <div className="section grid2">
            <TokenBarChart items={result.explanations} />
            <div className="card lift cardPad">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 950 }}>Recommended action</div>
                <span className="pill">Decision support</span>
              </div>

              <ul style={{ marginTop: 12, lineHeight: 1.75, fontWeight: 800 }}>
                {result.next_steps.slice(0, 3).map((s, i) => (
                  <li key={i} style={{ marginBottom: 10 }}>{s}</li>
                ))}
              </ul>

              <div style={{ marginTop: 12, color: "var(--muted)", fontWeight: 650 }}>
                Guidance is based on predicted risk level.
              </div>
            </div>
          </div>

          <div className="section card lift cardPad">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 950 }}>Highlighted evidence (in context)</div>
              <span className="pill">Local explanation</span>
            </div>
            <div style={{ marginTop: 12 }}>
              {highlightBody(body, result.highlight_spans)}
            </div>
          </div>
        </>
      )}

      <div className="footer">PHISHLENS • Explainability-first artefact</div>
    </div>
  );
}
