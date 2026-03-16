"use client";

import { motion } from "framer-motion";
import Reveal from "./components/Reveal";

function StatCard({
  title,
  value,
  description,
  source,
  delay = 0,
}: {
  title: string;
  value: string;
  description: string;
  source: string;
  delay?: number;
}) {
  return (
    <Reveal delay={delay}>
      <div className="card lift cardPad">
        <span className="pill">Contextual Evidence</span>

        <div style={{ marginTop: 12, fontWeight: 900, fontSize: 32 }}>
          {value}
        </div>

        <div style={{ marginTop: 8, fontWeight: 800 }}>
          {title}
        </div>

        <div
          style={{
            marginTop: 8,
            color: "var(--muted)",
            fontWeight: 600,
            lineHeight: 1.7,
          }}
        >
          {description}
        </div>

        <div
          style={{
            marginTop: 10,
            fontSize: 13,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          Source: {source}
        </div>
      </div>
    </Reveal>
  );
}

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
      <div
        style={{
          marginTop: 12,
          color: "var(--muted)",
          fontWeight: 650,
          lineHeight: 1.7,
        }}
      >
        {desc}
      </div>
    </div>
  );
}

export default function HomePage() {
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
          <span className="pill">PHISHLENS • Explainable AI Research Artefact</span>

          <h1 className="h1" style={{ marginTop: 14 }}>
            Making phishing <span className="glow">transparent</span>
          </h1>

          <p className="sub">
            PHISHLENS explores how explainable machine learning can support
            user understanding in phishing detection systems. Instead of
            returning only a classification label, the system provides
            probability scores, interpretable feature contributions,
            highlighted phrases, and contextual risk signals.
          </p>

          <div className="btnRow">
            <a href="/demo"><button className="btn">Open Demo</button></a>
            <a href="/xai"><button className="btnGhost">Explainability</button></a>
            <a href="/metrics"><button className="btnGhost">Model Evaluation</button></a>
          </div>
        </motion.div>

        {/* HERO VISUAL – PIPELINE */}
        <motion.div
          className="card lift cardPad"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="pill">System Workflow</span>

          <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
            {[
              "User Email Input",
              "Text Preprocessing",
              "TF-IDF Feature Extraction",
              "Logistic Regression Classifier",
              "Explainability Layer",
              "Interactive Evidence Dashboard"
            ].map((step, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 * i }}
                style={{
                  padding: 10,
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.03)",
                  fontWeight: 700,
                }}
              >
                {step}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* REAL CONTEXT SECTION */}
      <div className="section grid3">

        <StatCard
          title="Phishing as a Major Breach Vector"
          value="36%"
          description="Phishing is frequently reported as one of the leading initial attack vectors in cybersecurity breach reports."
          source="Verizon Data Breach Investigations Report (latest edition)"
          delay={0}
        />

        <StatCard
          title="Over 1 Million Attacks"
          value="1M+"
          description="The Anti-Phishing Working Group has reported over one million phishing attacks within a single quarter."
          source="APWG Phishing Activity Trends Report (2025)"
          delay={0.05}
        />

        <StatCard
          title="Billions Lost Annually"
          value="$10B+"
          description="Financial losses linked to cybercrime complaints, including phishing-related fraud, exceed billions annually."
          source="FBI Internet Crime Complaint Center (IC3) Report"
          delay={0.1}
        />

      </div>

      {/* USER GAP SECTION */}
      <Reveal delay={0.05}>
        <div className="section grid3">
          <FeatureCard
            icon="❓"
            title="The Gap"
            desc="Traditional filters often provide binary outputs without explaining why an email is flagged."
          />
          <FeatureCard
            icon="👁️"
            title="User Uncertainty"
            desc="Without interpretability, users may mistrust or misunderstand automated decisions."
          />
          <FeatureCard
            icon="🧪"
            title="Research Contribution"
            desc="This artefact investigates whether interpretable outputs improve transparency and decision support."
          />
        </div>
      </Reveal>

      {/* LIMITATIONS */}
      <Reveal delay={0.08}>
        <div className="section card lift cardPad">
          <span className="pill">Limitations</span>

          <div style={{ marginTop: 12, fontWeight: 900, fontSize: 22 }}>
            Experimental Academic Prototype
          </div>

          <div
            style={{
              marginTop: 10,
              color: "var(--muted)",
              fontWeight: 600,
              lineHeight: 1.7,
            }}
          >
            PHISHLENS is a research artefact developed for academic evaluation.
            The model is trained on publicly available datasets and is not
            intended for real-world deployment. Performance and probability
            outputs depend on dataset characteristics and feature engineering
            choices.
          </div>
        </div>
      </Reveal>

      <div className="footer">
        © {new Date().getFullYear()} PHISHLENS • Final Year Dissertation Artefact
      </div>

    </div>
  );
}