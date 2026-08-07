"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const BLADE_POINTS = "110,50 80,101.96 20,101.96 -10,50 20,-1.96 80,-1.96";
const DURATION = 760;

export default function ApertureReveal() {
  const pathname = usePathname();
  const [playing, setPlaying] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const reduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.classList.contains("a11y-reduced-motion");

    if (reduced) {
      setPlaying(false);
      return;
    }

    setKey((value) => value + 1);
    setPlaying(true);

    const timer = window.setTimeout(() => setPlaying(false), DURATION);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  if (!playing) return null;

  const maskId = "aperture-mask-" + key;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60]"
      key={key}
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <mask id={maskId}>
            <rect x="-50" y="-50" width="200" height="200" fill="white" />
            <polygon
              className="aperture-blades"
              points={BLADE_POINTS}
              fill="black"
            />
          </mask>
        </defs>
        <rect
          x="-50"
          y="-50"
          width="200"
          height="200"
          fill="var(--ink)"
          mask={"url(#" + maskId + ")"}
        />
        <polygon
          className="aperture-blades aperture-edge"
          points={BLADE_POINTS}
          fill="none"
          stroke="var(--safelight)"
          strokeWidth="0.4"
        />
      </svg>
    </div>
  );
}
