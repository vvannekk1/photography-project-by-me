import type { CSSProperties } from "react";

export default function GenreIcon({
  genre,
  className,
  style,
}: {
  genre: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 40 40"
      className={className}
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    >
      {genre === "portrait" && (
        <>
          <circle cx="20" cy="20" r="6" />
          <line x1="26" y1="20" x2="34" y2="20" />
          <line x1="23" y1="14.8" x2="27" y2="7.9" />
          <line x1="17" y1="14.8" x2="13" y2="7.9" />
          <line x1="14" y1="20" x2="6" y2="20" />
          <line x1="17" y1="25.2" x2="13" y2="32.1" />
          <line x1="23" y1="25.2" x2="27" y2="32.1" />
        </>
      )}
      {genre === "street" && (
        <>
          <line x1="4" y1="32" x2="36" y2="32" />
          <line x1="6" y1="32" x2="20" y2="14" />
          <line x1="34" y1="32" x2="20" y2="14" />
          <circle cx="20" cy="14" r="1.4" fill="currentColor" stroke="none" />
        </>
      )}
      {genre === "landscape" && (
        <>
          <polyline points="4,24 14,14 24,22 36,12" />
          <polyline points="4,32 16,24 28,30 36,24" opacity="0.5" />
          <circle cx="30" cy="10" r="3" />
        </>
      )}
      {genre === "architecture" && (
        <>
          <rect x="8" y="8" width="24" height="26" rx="1" />
          <line x1="16" y1="8" x2="16" y2="34" />
          <line x1="24" y1="8" x2="24" y2="34" />
          <line x1="8" y1="16" x2="32" y2="16" />
          <line x1="8" y1="25" x2="32" y2="25" />
        </>
      )}
    </svg>
  );
}
