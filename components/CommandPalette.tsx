"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export type PaletteItem = {
  label: string;
  href: string;
  kind: string;
  keywords: string;
};

const TRIGGER_CLASS =
  "flex items-center gap-2 rounded-full border border-[var(--frame)] px-3 py-1.5 font-mono-data text-[10px] uppercase tracking-wide text-[var(--ash)] transition hover:border-[var(--safelight)] hover:text-[var(--paper)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--safelight)]";

const INPUT_CLASS =
  "w-full bg-transparent px-5 py-4 text-lg text-[var(--paper)] placeholder:text-[var(--ash)] focus:outline-none";

function matches(item: PaletteItem, query: string): boolean {
  if (!query) return true;
  const haystack = (item.label + " " + item.kind + " " + item.keywords).toLowerCase();
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  return terms.every((term) => haystack.includes(term));
}

export default function CommandPalette({ items }: { items: PaletteItem[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const results = useMemo(
    () => items.filter((item) => matches(item, query)).slice(0, 8),
    [items, query]
  );

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
    if (lastFocused.current) lastFocused.current.focus();
  }, []);

  const go = useCallback(
    (item: PaletteItem | undefined) => {
      if (!item) return;
      setOpen(false);
      setQuery("");
      setActive(0);
      router.push(item.href);
    },
    [router]
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const isPaletteKey =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (isPaletteKey) {
        event.preventDefault();
        lastFocused.current = document.activeElement as HTMLElement;
        setOpen((wasOpen) => !wasOpen);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    if (inputRef.current) inputRef.current.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    if (!listRef.current) return;
    const node = listRef.current.children[active] as HTMLElement | undefined;
    if (node && node.scrollIntoView) node.scrollIntoView({ block: "nearest" });
  }, [active]);

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((current) =>
        results.length === 0 ? 0 : (current + 1) % results.length
      );
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((current) =>
        results.length === 0 ? 0 : (current - 1 + results.length) % results.length
      );
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      go(results[active]);
    }
  }

  function openPalette(event: React.MouseEvent<HTMLButtonElement>) {
    lastFocused.current = event.currentTarget;
    setOpen(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={openPalette}
        className={TRIGGER_CLASS}
        aria-label="Open quick search"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="16.5" y1="16.5" x2="21" y2="21" />
        </svg>
        <span className="hidden sm:inline">Search</span>
        <kbd className="rounded border border-[var(--frame)] px-1">&#8984;K</kbd>
      </button>

      {open && (
        <div
          className="fade-in fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 pt-[12vh]"
          onClick={close}
          role="presentation"
        >
          <div
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--frame)] bg-[var(--ink)] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Quick search"
          >
            <div className="flex items-center border-b border-[var(--frame)]">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Search spots, genres, pages…"
                className={INPUT_CLASS}
                role="combobox"
                aria-expanded="true"
                aria-controls="palette-results"
                aria-activedescendant={
                  results.length > 0 ? "palette-option-" + active : undefined
                }
                aria-autocomplete="list"
              />
              <button
                type="button"
                onClick={close}
                className="mr-4 rounded border border-[var(--frame)] px-2 py-1 font-mono-data text-[10px] uppercase text-[var(--ash)] transition hover:text-[var(--paper)]"
              >
                Esc
              </button>
            </div>

            {results.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-[var(--ash)]">
                Nothing matches that search.
              </p>
            ) : (
              <ul
                ref={listRef}
                id="palette-results"
                role="listbox"
                aria-label="Search results"
                className="max-h-80 overflow-y-auto py-2"
              >
                {results.map((item, index) => (
                  <li
                    key={item.href + item.label}
                    id={"palette-option-" + index}
                    role="option"
                    aria-selected={index === active}
                  >
                    <button
                      type="button"
                      onMouseEnter={() => setActive(index)}
                      onClick={() => go(item)}
                      className={
                        index === active
                          ? "flex w-full items-center justify-between gap-4 border-l-2 border-[var(--safelight)] bg-black/30 px-5 py-3 text-left"
                          : "flex w-full items-center justify-between gap-4 border-l-2 border-transparent px-5 py-3 text-left"
                      }
                    >
                      <span className="font-display text-[var(--paper)]">
                        {item.label}
                      </span>
                      <span className="font-mono-data text-[10px] uppercase tracking-wide text-[var(--ash)]">
                        {item.kind}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <p className="border-t border-[var(--frame)] px-5 py-2 font-mono-data text-[10px] uppercase tracking-wide text-[var(--ash)]">
              &#8593;&#8595; to move · Enter to open · Esc to close
            </p>
          </div>
        </div>
      )}
    </>
  );
}
