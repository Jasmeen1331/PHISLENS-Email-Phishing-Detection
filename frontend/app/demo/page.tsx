"use client";

import { useMemo, useState } from "react";
import AvatarCard from "../components/AvatarCard";

type Explain = { token: string; weight: number };
type Reason = { category: string; hits: string[] };
type Span = { start: number; end: number; text: string };

type PredictResponse = {
  label: string;
  probability_phishing: number;
  explanations: Explain[];
  reasons: Reason[];
  highlight_spans: Span[];
  summary: string;
};

function highlightBody(body: string, spans: Span[]) {
  if (!body) return <span className="preBox"></span>;
  if (!spans || spans.length === 0) return <span className="preBox">{body}</span>;

  // ensure spans sorted
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

  return <span className="preBox">{parts}</span>;
}

export default function DemoPage() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const avatarState = loading ? "thinking" : result ? "explaining" : "idle";
  const avatarMessage =
    loading
      ? "Analyzing content patterns + explainability evidence…"
      : result
      ? result.summary
      : "Paste an email and I’ll explain why it looks safe or suspicious.";

  const confidencePct = useMemo(() => {
    if (!result) return 0;
    return Math.max(0, Math.min(100, result.probability_phishing * 100));
  }, [result]);

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

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt);
      }

      const data = (await res.json()) as PredictResponse;
      setResult(data);
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
    setSubject("");
    setBody("");
    setResult(null);
    setError(null);
  }

  return (
    <div className="container">
      <div className="nav">
        <h2>PhsiLens</h2>
        <div className="links">
          <a href="/">Home</a>
        </div>
      </div>

      {/* AI Avatar panel */}
      <AvatarCard status={avatarState as any} message={avatarMessage} />

      <div className="card section">
        <h1 style={{ marginTop: 0 }}>Phishing Detection Demo</h1>
        <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>
          Paste an email subject/body. PhsiLens returns a prediction plus explainability evidence.
        </p>

        <div className="btnRow">
          <button className="buttonOutline" onClick={loadPhishing}>Load phishing example</button>
          <button className="buttonOutline" onClick={loadLegit}>Load legit example</button>
          <button className="buttonOutline" onClick={clearAll}>Clear</button>
        </div>

        <label className="formLabel">Subject</label>
        <input value={subject} onChange={(e) => setSubject(e.target.value)} />

        <label className="formLabel">Body</label>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} />

        <button className="button" style={{ marginTop: 14 }} onClick={analyze} disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Email"}
        </button>

        {error && <p style={{ color: "crimson", marginTop: 12 }}>{error}</p>}
      </div>

      {result && (
        <div className="card section">
          <h2 style={{ marginTop: 0 }}>Result</h2>

          <p>
            <b>Classification:</b>{" "}
            {result.label === "phishing_or_spam" ? (
              <span className="resultBad">⚠️ Phishing/Spam</span>
            ) : (
              <span className="resultGood">✅ Legitimate</span>
            )}
          </p>

          <p style={{ marginBottom: 8 }}>
            <b>Phishing probability:</b> {confidencePct.toFixed(1)}%
          </p>

          <div className="barWrap">
            <div className="barFill" style={{ width: `${confidencePct}%` }} />
          </div>

          {/* User-friendly reason categories */}
          <div className="section">
            <div className="reasonTitle">User-friendly reasons</div>
            {result.reasons?.length ? (
              result.reasons.map((r) => (
                <div key={r.category} style={{ marginTop: 10 }}>
                  <div style={{ fontWeight: 900 }}>{r.category}</div>
                  <div className="badgeRow">
                    {r.hits.map((h) => (
                      <span key={h} className="badge">{h}</span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: "var(--muted)" }}>No rule-based indicators matched; decision comes from learned patterns.</p>
            )}
          </div>

          {/* Evidence tokens from ML model */}
          <div className="section">
            <div className="reasonTitle">Model evidence tokens</div>
            <div className="badgeRow">
              {result.explanations?.length ? (
                result.explanations.map((e) => (
                  <span key={e.token} className="badge">{e.token}</span>
                ))
              ) : (
                <span style={{ color: "var(--muted)" }}>No evidence tokens found.</span>
              )}
            </div>
          </div>

          {/* Highlighted body */}
          <div className="section">
            <div className="reasonTitle">Highlighted email body</div>
            <div className="card" style={{ marginTop: 10 }}>
              {highlightBody(body, result.highlight_spans)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
