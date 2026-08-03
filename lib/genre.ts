export const GENRE_GRADIENTS: Record<string, string> = {
  portrait: "linear-gradient(160deg, rgba(214,71,43,0.22), var(--ink))",
  street: "linear-gradient(160deg, rgba(42,41,36,0.9), var(--ink))",
  landscape: "linear-gradient(160deg, rgba(147,168,126,0.20), var(--ink))",
  architecture: "linear-gradient(160deg, rgba(155,152,144,0.16), var(--ink))",
};

export function genreGradient(genre: string): string {
  return GENRE_GRADIENTS[genre] ?? GENRE_GRADIENTS.portrait;
}

const GENRE_ICON_COLORS: Record<string, string> = {
  portrait: "var(--safelight)",
  street: "var(--paper)",
  landscape: "var(--meter-green)",
  architecture: "var(--ash)",
};

export function genreIconColor(genre: string): string {
  return GENRE_ICON_COLORS[genre] ?? GENRE_ICON_COLORS.portrait;
}
