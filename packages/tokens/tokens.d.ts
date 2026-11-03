/* Generated from tokens.json by scripts/build-tokens.mjs. Do not edit. */
type Colors = Record<"bg" | "surface" | "surfaceMuted" | "text" | "muted" | "border" | "primary" | "onPrimary" | "link" | "success" | "error" | "warning" | "accent" | "info" | "overlay" | "borderSubtle" | "glassBg" | "glassBorder" | "glassHighlight" | "glassShadow", string>;
declare const tokens: {
  brand: Record<"graphite" | "paper" | "lime" | "violet", string>;
  light: Colors;
  dark: Colors;
  space: number[];
  radius: { control: number; card: number; pill: number };
  type: { family: string; mono: string; body: number; small: number; h1: number; h2: number; h3: number; marketing: { body: number; display: number } };
  motion: { fast: string; normal: string; slow: string; ease: string };
  [key: string]: unknown;
};
export default tokens;
export declare const cssVar: (name: string) => string;
