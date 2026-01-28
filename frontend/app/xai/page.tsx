"use client";

import { useMemo } from "react";

function ExampleHighlight() {
  const body =
    "Urgent: Your account will be suspended. Click this link to verify your password immediately.";
  const spans = [
    { start: 0, end: 6 },
    { start: 32, end: 41 },
    { start: 43, end: 52 },
    { start: 58, end: 64 },
    { start: 68, end: 76 },
    { start: 77, end: 85 },
  ];

  const content = useMemo(() => {
    const parts: any[] = [];
    let cursor = 0;
    spans.forEach((s, i) => {
      parts.push(body.slice(cursor, s.start));
      parts.push(<mark key={i}>{body.slice(s.start, s.end)}</mark>);
      cursor = s.end;
    });
    parts.push(body.slice(cursor));
    return parts;
  }, []);

  return <div className="pre">{content}</div>;
}

export default function XaiPage() {
  return (
    <div className="container">
      <div className="card lift cardPad">
        <span className="pill">Explainable AI</span>
        <div style={{ fontWeight: 950, fontSize: 34, marginTop: 10 }}>
          PHISHLENS is unique because it{" "}
          <span className="glow">shows evidence</span>.
        </div>
        <div style={{ color: "var(--muted)", fontWeight: 650, marginTop: 10, lineHeight: 1.7 }}>
          Most systems return a label. PHISHLENS returns a label + visual proof.
          The dashboard is designed for human trust and fast decision-making.
        </div>
      </div>

      <div className="section grid3">
        <div className="card lift cardPad">
          <span className="pill">Layer 1</span>
          <div style={{ fontWeight: 950, fontSize: 18, marginTop: 10 }}>Risk meter</div>
          <div style={{ color: "var(--muted)", fontWeight: 650, marginTop: 8, lineHeight: 1.6 }}>
            A probability gauge that shows confidence (not just a binary label).
          </div>
        </div>

        <div className="card lift cardPad">
          <span className="pill">Layer 2</span>
          <div style={{ fontWeight: 950, fontSize: 18, marginTop: 10 }}>Risk breakdown</div>
          <div style={{ color: "var(--muted)", fontWeight: 650, marginTop: 8, lineHeight: 1.6 }}>
            Model-derived category signals: urgency, credentials, links, threats, money.
          </div>
        </div>

        <div className="card lift cardPad">
          <span className="pill">Layer 3</span>
          <div style={{ fontWeight: 950, fontSize: 18, marginTop: 10 }}>Local evidence</div>
          <div style={{ color: "var(--muted)", fontWeight: 650, marginTop: 8, lineHeight: 1.6 }}>
            Token contributions + highlighted phrases show what triggered suspicion in context.
          </div>
        </div>
      </div>

      <div className="section grid2">
        <div className="card lift cardPad">
          <span className="pill">Example</span>
          <div style={{ fontWeight: 950, fontSize: 20, marginTop: 10 }}>
            Highlighted evidence (in context)
          </div>
          <div style={{ color: "var(--muted)", fontWeight: 650, marginTop: 8, lineHeight: 1.7 }}>
            Users can directly see the suspicious phrases that contributed to the classification.
          </div>

          <div style={{ marginTop: 14 }}>
            <ExampleHighlight />
          </div>
        </div>

        <div className="card lift cardPad">
          <span className="pill">How to read the dashboard</span>

          <div style={{ marginTop: 12 }}>
            <div style={{ fontWeight: 950 }}>1) Start with probability</div>
            <div style={{ color: "var(--muted)", fontWeight: 650, marginTop: 6, lineHeight: 1.6 }}>
              High probability = higher phishing risk.
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 950 }}>2) Check breakdown categories</div>
            <div style={{ color: "var(--muted)", fontWeight: 650, marginTop: 6, lineHeight: 1.6 }}>
              Which tactics are driving the risk (e.g., links + credentials)?
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 950 }}>3) Verify with evidence</div>
            <div style={{ color: "var(--muted)", fontWeight: 650, marginTop: 6, lineHeight: 1.6 }}>
              Token contribution bars + highlights provide local evidence.
            </div>
          </div>

          <div className="btnRow">
            <a href="/demo"><button className="btn">Try the Demo</button></a>
            <a href="/metrics"><button className="btnGhost">Model Metrics</button></a>
          </div>
        </div>
      </div>

      <div className="footer">PHISHLENS • Explainability-first artefact</div>
    </div>
  );
}
