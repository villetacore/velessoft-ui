let counter = 0;
export const uid = (prefix: string) => `${prefix}-${++counter}`;

export const ensureId = (el: Element, prefix: string) => {
  if (!el.id) el.id = uid(prefix);
  return el.id;
};

export function emit<T>(
  el: HTMLElement,
  type: string,
  detail: T,
  cancelable = false,
) {
  return el.dispatchEvent(
    new CustomEvent<T>(type, {
      detail,
      bubbles: true,
      composed: true,
      cancelable,
    }),
  );
}

export function define(name: string, ctor: CustomElementConstructor) {
  if (typeof customElements !== "undefined" && !customElements.get(name))
    customElements.define(name, ctor);
}

// Lets the module load during server rendering, where HTMLElement does not exist.
const Base = (
  typeof HTMLElement === "undefined" ? class {} : HTMLElement
) as typeof HTMLElement;

/** Base for light-DOM elements: framework-rendered children stay in place and get Velessoft CSS. */
export class VsElement extends Base {
  protected cleanup: (() => void)[] = [];
  protected listen<K extends keyof DocumentEventMap>(
    target: Document | HTMLElement | Window,
    type: K,
    handler: (event: DocumentEventMap[K]) => void,
  ) {
    target.addEventListener(type, handler as EventListener);
    this.cleanup.push(() =>
      target.removeEventListener(type, handler as EventListener),
    );
  }
  disconnectedCallback() {
    this.cleanup.splice(0).forEach((fn) => fn());
  }
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
