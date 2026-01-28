"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  to: number;
  durationMs?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
};

export default function CountUp({
  to,
  durationMs = 900,
  decimals = 0,
  prefix = "",
  suffix = "",
}: Props) {
  const [val, setVal] = useState(0);

  const fmt = useMemo(() => {
    const f = new Intl.NumberFormat(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return (n: number) => `${prefix}${f.format(n)}${suffix}`;
  }, [decimals, prefix, suffix]);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const from = 0;

    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / durationMs);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      const current = from + (to - from) * eased;
      setVal(current);
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, durationMs]);

  return <>{fmt(val)}</>;
}
