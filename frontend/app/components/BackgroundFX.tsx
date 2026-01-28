"use client";

import { useEffect, useState } from "react";

export default function BackgroundFX() {
  const [xy, setXy] = useState({ x: 50, y: 35 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = Math.round((e.clientX / window.innerWidth) * 100);
      const y = Math.round((e.clientY / window.innerHeight) * 100);
      setXy({ x, y });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <svg className="fx" viewBox="0 0 1000 700" preserveAspectRatio="none">
      <defs>
        <radialGradient id="g1" cx={`${xy.x}%`} cy={`${xy.y}%`} r="60%">
          <stop offset="0%" stopColor="rgba(34,211,238,0.35)" />
          <stop offset="60%" stopColor="rgba(34,211,238,0)" />
        </radialGradient>
        <radialGradient id="g2" cx={`${100 - xy.x}%`} cy={`${xy.y}%`} r="60%">
          <stop offset="0%" stopColor="rgba(167,139,250,0.30)" />
          <stop offset="60%" stopColor="rgba(167,139,250,0)" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="1000" height="700" fill="url(#g1)" />
      <rect x="0" y="0" width="1000" height="700" fill="url(#g2)" />

      {/* subtle grid */}
      <g opacity="0.12">
        {Array.from({ length: 24 }).map((_, i) => (
          <line key={i} x1={i * 45} y1="0" x2={i * 45} y2="700" stroke="white" strokeWidth="1" />
        ))}
        {Array.from({ length: 18 }).map((_, i) => (
          <line key={i} x1="0" y1={i * 45} x2="1000" y2={i * 45} stroke="white" strokeWidth="1" />
        ))}
      </g>
    </svg>
  );
}
