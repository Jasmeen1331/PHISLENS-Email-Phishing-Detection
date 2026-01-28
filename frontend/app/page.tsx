"use client";

import { motion } from "framer-motion";
import Reveal from "./components/Reveal";
import CountUpOnView from "./components/CountUpOnView";

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="card lift cardPad">
      <span className="pill">{icon} {title}</span>
      <div style={{ marginTop: 12, color: "var(--muted)", fontWeight: 650, lineHeight: 1.7 }}>
        {desc}
      </div>
    </div>
  );
}

function StatCard({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  label,
  source,
  delay = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  source: string;
  delay?: number;
}) {
  return (
    <Reveal delay={delay}>
      <div className="card lift cardPad">
        <span className="pill">Real-world scale</span>

        <div style={{ marginTop: 12, fontWeight: 950, fontSize: 42, letterSpacing: -0.3 }}>
          <CountUpOnView to={value} prefix={prefix} suffix={suffix} decimals={decimals} />
        </div>

        <div style={{ marginTop: 8, color: "var(--muted)", fontWeight: 650, lineHeight: 1.6 }}>
          {label}
        </div>

        <div style={{ marginTop: 12, color: "rgba(255,255,255,0.55)", fontWeight: 650, fontSize: 13 }}>
          Source: {source}
        </div>
      </div>
    </Reveal>
  );
}

function MiniMockDashboard() {
  return (
    <div className="card lift cardPad">
      <span className="pill">Preview • Explainability dashboard</span>

      <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "160px 1fr", gap: 16, alignItems: "center" }}>
        {/* Example donut */}
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: 999,
            background: "conic-gradient(var(--cyan) 260deg, rgba(255,255,255,0.10) 0deg)",
            border: "1px solid rgba(255,255,255,0.14)",
            display: "grid",
            placeItems: "center",
          }}
        >
          <div
            style={{
              width: 118,
              height: 118,
              borderRadius: 999,
              background: "rgba(7,10,18,0.55)",
              border: "1px solid rgba(255,255,255,0.12)",
              display: "grid",
              placeItems: "center",
              textAlign: "center",
              padding: 10,
            }}
          >
            <div style={{ fontWeight: 950, fontSize: 22 }}>Example</div>
            <div style={{ color: "var(--muted)", fontWeight: 800, fontSize: 12 }}>
              72% phishing probability
            </div>
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 950, fontSize: 18 }}>
            <span className="bad">⚠️ High risk</span>
          </div>

          <div style={{ marginTop: 10, color: "var(--muted)", fontWeight: 650, lineHeight: 1.65 }}>
            The dashboard shows: probability, category breakdown, token contributions, and highlighted phrases.
          </div>

          <div className="badges" style={{ marginTop: 12 }}>
            {["Urgency", "Credentials", "Links", "Threats"].map((t) => (
              <span className="badge" key={t}>{t}</span>
            ))}
          </div>

          <div style={{ marginTop: 12 }}>
            <div className="barWrap">
              <div className="barFill" style={{ width: "72%" }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
        {[
          ["verify", 0.9],
          ["password", 0.75],
          ["urgent", 0.65],
          ["click", 0.55],
        ].map(([k, v]) => (
          <div key={String(k)}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--muted)", fontWeight: 800, fontSize: 13 }}>
              <span>{k}</span>
              <span>{Math.round((v as number) * 100)}%</span>
            </div>
            <div className="barWrap" style={{ marginTop: 6 }}>
              <div className="barFill" style={{ width: `${(v as number) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12, color: "rgba(255,255,255,0.55)", fontWeight: 650, fontSize: 13 }}>
        Example output for illustration. Evaluated performance is shown on the Metrics page.
      </div>
    </div>
  );
}

export default function HomePage() {
  // 100M/day ≈ 69,444/min
  const PHISH_PER_MIN = 69444;

  return (
    <div className="container">
      {/* HERO */}
      <div className="grid2" style={{ marginTop: 18 }}>
        <motion.div
          className="card lift cardPad"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="pill">PHISHLENS • Explainable AI</span>

          <h1 className="h1" style={{ marginTop: 14 }}>
            Make phishing <span className="glow">visible</span>.
          </h1>

          <p className="sub">
            PHISHLENS doesn’t just classify email. It shows evidence—risk meter, category breakdown,
            token contributions, and highlighted phrases.
          </p>

          <div className="btnRow">
            <a href="/demo"><button className="btn">Open Demo</button></a>
            <a href="/xai"><button className="btnGhost">Explainability</button></a>
            <a href="/metrics"><button className="btnGhost">Model metrics</button></a>
          </div>

          <div className="badges" style={{ marginTop: 14 }}>
            {["Visual dashboard", "Evidence-first", "User trust", "Decision support"].map((t) => (
              <span className="badge" key={t}>{t}</span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
        >
          <MiniMockDashboard />
        </motion.div>
      </div>

      {/* PROBLEM STORY + COUNT-UP STATS */}
      <Reveal delay={0.02}>
        <div className="section card lift cardPad">
          <span className="pill">The problem</span>
          <div style={{ marginTop: 12, fontWeight: 950, fontSize: 28 }}>
            Email attacks are high-volume — and users rarely get explanations.
          </div>
          <div style={{ marginTop: 10, color: "var(--muted)", fontWeight: 650, lineHeight: 1.75 }}>
            PHISHLENS targets the gap: detection plus explainability designed for human understanding.
          </div>
        </div>
      </Reveal>

      <div className="section grid3">
        <StatCard
          value={47}
          suffix="%"
          label="Estimated share of global email that is spam."
          source="Industry estimates"
          delay={0.00}
        />
        <StatCard
          value={PHISH_PER_MIN}
          suffix="/min"
          label="Approx phishing emails blocked per minute at major provider scale."
          source="Provider-scale reporting summaries"
          delay={0.06}
        />
        <StatCard
          value={16}
          prefix="$"
          suffix="B+"
          label="Reported losses from internet crime complaints in 2024 (US)."
          source="FBI IC3 reporting"
          delay={0.12}
        />
      </div>

      <div className="section grid2">
        <StatCard
          value={1003924}
          label="Phishing attacks observed in Q1 2025."
          source="APWG trends report"
          delay={0.00}
        />
        <Reveal delay={0.08}>
          <div className="card lift cardPad">
            <span className="pill">Why PHISHLENS</span>
            <div style={{ marginTop: 12, fontWeight: 950, fontSize: 22 }}>
              Labels don’t build trust. Evidence does.
            </div>
            <div style={{ marginTop: 10, color: "var(--muted)", fontWeight: 650, lineHeight: 1.7 }}>
              The artefact turns model output into a product-style dashboard:
            </div>
            <div className="badges" style={{ marginTop: 12 }}>
              {["Risk meter", "Breakdown graph", "Token chart", "Highlights", "Next steps"].map((t) => (
                <span key={t} className="badge">{t}</span>
              ))}
            </div>
            <div className="btnRow">
              <a href="/demo"><button className="btn">See dashboard</button></a>
              <a href="/metrics"><button className="btnGhost">See evaluation</button></a>
            </div>
          </div>
        </Reveal>
      </div>

      {/* BENTO: SIMPLE, CLEAN */}
      <Reveal delay={0.02}>
        <div className="section grid3">
          <FeatureCard
            icon="🛡️"
            title="Detect"
            desc="Predict phishing probability from subject + body."
          />
          <FeatureCard
            icon="📊"
            title="Explain"
            desc="Show risk categories and token contributions driving the decision."
          />
          <FeatureCard
            icon="🧠"
            title="Support action"
            desc="Highlight suspicious phrases and recommend safe next steps."
          />
        </div>
      </Reveal>

      {/* PIPELINE STRIP */}
      <Reveal delay={0.03}>
        <div className="section card lift cardPad">
          <span className="pill">How it works</span>
          <div style={{ marginTop: 12, fontWeight: 950, fontSize: 26 }}>Pipeline</div>

          <div className="badges" style={{ marginTop: 12 }}>
            {["Email input", "Preprocess", "TF-IDF features", "Classifier", "Evidence dashboard"].map((t) => (
              <span className="badge" key={t}>{t}</span>
            ))}
          </div>

          <div style={{ marginTop: 12, color: "var(--muted)", fontWeight: 650, lineHeight: 1.75 }}>
            The system demonstrates a complete workflow: user input → prediction → explainability.
          </div>
        </div>
      </Reveal>

      {/* FINAL CTA */}
      <Reveal delay={0.04}>
        <div className="section card lift cardPad">
          <span className="pill">Try it</span>
          <div style={{ marginTop: 12, fontWeight: 950, fontSize: 26 }}>
            Run the explainability demo
          </div>
          <div style={{ marginTop: 10, color: "var(--muted)", fontWeight: 650, lineHeight: 1.7 }}>
            Load examples, inspect risk graphs, token contributions, and highlighted evidence.
          </div>
          <div className="btnRow">
            <a href="/demo"><button className="btn">Open Demo</button></a>
            <a href="/xai"><button className="btnGhost">Explainability</button></a>
            <a href="/metrics"><button className="btnGhost">Metrics</button></a>
          </div>
        </div>
      </Reveal>

      <div className="footer">© {new Date().getFullYear()} PHISHLENS • Dissertation artefact</div>
    </div>
  );
}
