import { useCallback, useState } from "react";

export type Tone = "neutral" | "info" | "success" | "warning" | "error";
export type Size = "sm" | "md" | "lg";

export const cls = (...names: (string | undefined | null | false)[]) =>
  names.filter(Boolean).join(" ");

export const ids = (...values: (string | undefined | null | false)[]) =>
  values.filter(Boolean).join(" ") || undefined;

export const sizeClass = (size: Size | undefined) =>
  size && size !== "md" ? `vs-${size}` : undefined;

/** State that is controlled when `value` is defined and internal otherwise. */
export function useControllable<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): [T, (value: T) => void] {
  const [inner, setInner] = useState(defaultValue);
  const controlled = value !== undefined;
  const set = useCallback(
    (next: T) => {
      if (!controlled) setInner(next);
      onChange?.(next);
    },
    [controlled, onChange],
  );
  return [controlled ? value : inner, set];
}

/** Pins a floating element to its anchor with fixed coordinates so scroll containers cannot clip it. */
export function placeFloating(
  anchor: HTMLElement,
  floating: HTMLElement,
  align: "start" | "end" = "start",
) {
  const a = anchor.getBoundingClientRect();
  const f = floating.getBoundingClientRect();
  const gap = 4;
  const fitsBelow =
    a.bottom + gap + f.height <= window.innerHeight ||
    a.top - gap - f.height < 0;
  const top = fitsBelow ? a.bottom + gap : a.top - gap - f.height;
  const left = Math.max(
    8,
    Math.min(
      align === "end" ? a.right - f.width : a.left,
      window.innerWidth - f.width - 8,
    ),
  );
  Object.assign(floating.style, {
    position: "fixed",
    top: `${top}px`,
    left: `${left}px`,
    right: "auto",
  });
}

/** Re-runs `place` while the page scrolls or resizes; returns a cleanup function. */
export function trackPlacement(place: () => void) {
  place();
  window.addEventListener("scroll", place, true);
  window.addEventListener("resize", place);
  return () => {
    window.removeEventListener("scroll", place, true);
    window.removeEventListener("resize", place);
  };
}
