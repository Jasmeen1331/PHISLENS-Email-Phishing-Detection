"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  to: number;
  durationMs?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
};

export default function CountUpOnView({
  to,
  durationMs = 900,
  decimals = 0,
  prefix = "",
  suffix = "",
}: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [started, setStarted] = useState(false);
  const [val, setVal] = useState(0);

  const fmt = useMemo(() => {
    const f = new Intl.NumberFormat(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return (n: number) => `${prefix}${f.format(n)}${suffix}`;
  }, [decimals, prefix, suffix]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    let raf = 0;
    const start = performance.now();
    const from = 0;

    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setVal(from + (to - from) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, to, durationMs]);

  return <span ref={ref}>{fmt(val)}</span>;
}
