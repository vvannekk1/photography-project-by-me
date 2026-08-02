"use client";

import { useEffect, useState } from "react";

export default function AccessibilityControls() {
  const [open, setOpen] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Restore saved preferences on first load
  useEffect(() => {
    const saved = localStorage.getItem("a11y-prefs");
    if (saved) {
      const p = JSON.parse(saved);
      setLargeText(!!p.largeText);
      setHighContrast(!!p.highContrast);
      setReducedMotion(!!p.reducedMotion);
    }
  }, []);

  // Apply preferences to the document root and persist them
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("a11y-large-text", largeText);
    root.classList.toggle("a11y-high-contrast", highContrast);
    root.classList.toggle("a11y-reduced-motion", reducedMotion);
    localStorage.setItem(
      "a11y-prefs",
      JSON.stringify({ largeText, highContrast, reducedMotion })
    );
  }, [largeText, highContrast, reducedMotion]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <div
          role="region"
          aria-label="Accessibility settings"
          className="mb-3 w-64 rounded-xl border border-neutral-700 bg-neutral-900 p-4 shadow-xl"
        >
          <h2 className="mb-3 text-sm font-semibold text-amber-400">
            Accessibility settings
          </h2>

          <div className="flex flex-col gap-3 text-sm">
            <label htmlFor="a11y-text" className="flex items-center justify-between gap-3">
              <span>Larger text</span>
              <input
                id="a11y-text"
                type="checkbox"
                checked={largeText}
                onChange={(e) => setLargeText(e.target.checked)}
                className="h-4 w-4 accent-amber-400"
              />
            </label>

            <label htmlFor="a11y-contrast" className="flex items-center justify-between gap-3">
              <span>High contrast</span>
              <input
                id="a11y-contrast"
                type="checkbox"
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
                className="h-4 w-4 accent-amber-400"
              />
            </label>

            <label htmlFor="a11y-motion" className="flex items-center justify-between gap-3">
              <span>Reduce motion</span>
              <input
                id="a11y-motion"
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                className="h-4 w-4 accent-amber-400"
              />
            </label>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Toggle accessibility settings"
        className="rounded-full border border-neutral-700 bg-neutral-900 px-5 py-3 text-sm font-semibold hover:border-amber-400 focus:outline-2 focus:outline-offset-2 focus:outline-amber-400"
      >
        Accessibility
      </button>
    </div>
  );
}