import { define, emit, VsElement } from "./shared.js";

export type Theme = "light" | "dark";
const KEY = "vs-theme";

const read = (): Theme | null => {
  try {
    const value = localStorage.getItem(KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
};

/** Sets `data-theme` on <html> (or `target`) and remembers the choice. */
export function setTheme(
  theme: Theme,
  target: HTMLElement = document.documentElement,
) {
  target.dataset.theme = theme;
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* storage may be unavailable */
  }
}

/** Saved theme, then the OS preference. */
export function getTheme(): Theme {
  return (
    read() ??
    (globalThis.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light")
  );
}

/**
 * <vs-theme-toggle><button class="vs-button">Theme</button></vs-theme-toggle>
 * Toggles light/dark on <html> or on the element matched by the `target` selector.
 */
export class VsThemeToggle extends VsElement {
  connectedCallback() {
    const target = () =>
      (this.getAttribute("target") &&
        document.querySelector<HTMLElement>(this.getAttribute("target")!)) ||
      document.documentElement;
    const button = this.querySelector("button");
    const update = (theme: Theme) =>
      button?.setAttribute("aria-pressed", String(theme === "dark"));
    const initial = (target().dataset.theme as Theme | undefined) ?? getTheme();
    setTheme(initial, target());
    update(initial);
    this.listen(this, "click", (e) => {
      if (!(e.target as Element).closest("button")) return;
      const next: Theme = target().dataset.theme === "dark" ? "light" : "dark";
      setTheme(next, target());
      update(next);
      emit(this, "vs-change", { theme: next });
    });
  }
}

define("vs-theme-toggle", VsThemeToggle);
