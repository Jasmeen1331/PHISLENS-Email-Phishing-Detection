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
  risk_band?: string;
  confidence_score?: number;
  error?: string;
  explanations?: Explain[];
  reasons?: Reason[];
  risk_breakdown?: Record<string, number>;
  highlight_spans?: Span[];
  summary?: string;
  next_steps?: string[];
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
    parts.push(
      <mark key={`${s.start}-${s.end}-${i}`}>
        {body.slice(s.start, s.end)}
      </mark>
    );
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

  const pct = useMemo(() => {
    return result
      ? Math.max(0, Math.min(100, result.probability_phishing * 100))
      : 0;
  }, [result]);

  const riskLevel = useMemo(() => {
    if (!result) return null;
    if (pct < 30) return "low";
    if (pct < 60) return "moderate";
    return "high";
  }, [pct, result]);

  const explanations = result?.explanations ?? [];
  const riskBreakdown = result?.risk_breakdown ?? {};
  const nextSteps = result?.next_steps ?? [];
  const highlightSpans = result?.highlight_spans ?? [];
  const highlightCount = highlightSpans.length;

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
      const data = (await res.json()) as ApiResp;
      setResult(data);
      if (data.error) setError(data.error);
    } catch (e: any) {
      setError(e?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  }

  function loadPhishing() {
    setSubject("Urgent: Verify your account now");
    setBody(
      "Your account will be suspended. Click this link to verify your password immediately."
    );
  }

  function loadLegit() {
    setSubject("Meeting agenda for tomorrow");
    setBody(
      "Hi team, attached is the agenda for tomorrow’s meeting. Please review before 10am."
    );
  }

  function pasteFullEmail(raw: string) {
    const lines = raw.trim().split(/\r?\n/);
    const subj = lines[0]?.trim() ?? "";
    const rest = lines.slice(1).join("\n").trim();
    setSubject(subj);
    setBody(rest);
  }

  return (
    <div className="container">

      {/* Header */}
      <div className="card lift cardPad">
        <span className="pill">PHISHLENS • Email Phishing Detection</span>

        <div style={{ fontWeight: 950, fontSize: 30, marginTop: 10 }}>
          Email Phishing Detection
        </div>

        <div style={{ color: "var(--muted)", fontWeight: 650, marginTop: 6 }}>
          This dashboard presents the model’s estimated phishing likelihood
          Paste or type an email subject and body below. The model estimates
          phishing likelihood to help you decide whether an email is safe.
        </div>

        {error && (
          <div style={{ marginTop: 12, color: "var(--pink)", fontWeight: 900 }}>
            {error}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="section demoGrid">
        <div className="card lift cardPad">
          <span className="pill">Input Email</span>

          <label>Subject</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Urgent: Verify your account"
          />

          <label>Body</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Paste or type the email body here..."
            rows={8}
          />

          <div className="btnRow" style={{ marginTop: 16 }}>
            <button
              className="btnGhost"
              onClick={() => {
                navigator.clipboard.readText().then(pasteFullEmail).catch(() => {});
              }}
              title="Paste from clipboard: first line = subject, rest = body"
            >
              Paste email from clipboard
            </button>
            <button className="btnGhost" onClick={loadPhishing}>
              Load phishing example
            </button>
            <button className="btnGhost" onClick={loadLegit}>
              Load legitimate example
            </button>
            <button className="btn" onClick={analyze} disabled={loading}>
              {loading ? "Analyzing…" : "Analyze email"}
            </button>
          </div>
        </div>

        {/* Decision Summary */}
        <div className="card lift cardPad">
          <span className="pill">
            Model-estimated phishing likelihood
          </span>

          {!result ? (
            <div style={{ marginTop: 14, color: "var(--muted)" }}>
              Run analysis to generate prediction and evidence.
            </div>
          ) : (
            <>
              <div style={{ marginTop: 12, fontWeight: 950, fontSize: 32 }}>
                {pct.toFixed(0)}%
              </div>

              <div style={{ marginTop: 8, fontWeight: 800 }}>
                {riskLevel === "low" &&
                  "Low likelihood based on learned patterns."}
                {riskLevel === "moderate" &&
                  "Moderate likelihood — review highlighted evidence carefully."}
                {riskLevel === "high" &&
                  "High likelihood — strong phishing indicators detected."}
              </div>

              <div
                style={{
                  marginTop: 10,
                  fontSize: 13,
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                This percentage reflects the model’s statistical confidence
                based on training data. It does not guarantee that the email
                is malicious or safe.
              </div>

              <div
                style={{
                  marginTop: 8,
                  fontSize: 13,
                  color: "rgba(255,255,255,0.45)",
                }}
              >
                Backend uses a tuned threshold from model training (see Metrics).
              </div>

              <div className="barWrap" style={{ marginTop: 12 }}>
                <div className="barFill" style={{ width: `${pct}%` }} />
              </div>

              <div style={{ marginTop: 12 }}>
                Highlighted evidence spans: <strong>{highlightCount}</strong>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Evidence Section */}
      {result && (
        <>
          <div className="section grid2">
            <SignalDonut pct={pct} label={result.label} />
            <MiniBars
              title="Risk signal breakdown"
              items={Object.entries(riskBreakdown).map(
                ([label, value]) => ({ label, value })
              )}
            />
          </div>

          <div className="section grid2">
            <TokenBarChart items={explanations} />

            <div className="card lift cardPad">
              <span className="pill">Recommended Action</span>

              <ul style={{ marginTop: 12, lineHeight: 1.75 }}>
                {nextSteps.slice(0, 5).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>

              <div
                style={{
                  marginTop: 10,
                  fontSize: 13,
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                Guidance is derived from predicted likelihood bands.
              </div>
            </div>
          </div>

          <div className="section card lift cardPad">
            <span className="pill">Highlighted Evidence (Context)</span>
            <div style={{ marginTop: 12 }}>
              {highlightBody(body, highlightSpans)}
            </div>
          </div>
        </>
      )}

      <div className="footer">
        PHISHLENS • Explainability-first research prototype
      </div>
    </div>
  );
}