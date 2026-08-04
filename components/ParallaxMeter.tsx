"use client";

import { useEffect, useRef, useState } from "react";

export default function ParallaxMeter({
  children,
  strength = 0.08,
  max = 40,
}: {
  children: React.ReactNode;
  strength?: number;
  max?: number;
}) {
  const [offset, setOffset] = useState(0);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const reduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.classList.contains("a11y-reduced-motion");

    if (reduced) return;

    function onScroll() {
      if (frame.current !== null) return;
      frame.current = window.requestAnimationFrame(() => {
        const next = Math.min(window.scrollY * strength, max);
        setOffset(next);
        frame.current = null;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    };
  }, [strength, max]);

  return (
    <div
      style={{
        transform: "translate3d(0, " + offset.toFixed(1) + "px, 0)",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}
