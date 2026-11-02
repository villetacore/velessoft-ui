import { define, VsElement } from "./shared.js";

export type ToastOptions = {
  title: string;
  description?: string;
  tone?: "info" | "success" | "warning" | "error";
  /** Milliseconds; 0 keeps the toast until closed. Defaults to the `duration` attribute or 5000. */
  duration?: number;
};

/**
 * <vs-toaster placement="bottom" close-label="Close"></vs-toaster>
 * Call `toaster.show({ title, description, tone })` or the exported `toast()` helper.
 * The element owns its children; render it empty.
 */
export class VsToaster extends VsElement {
  connectedCallback() {
    this.classList.add("vs-toaster");
    this.classList.toggle("vs-top", this.getAttribute("placement") === "top");
    if (!this.hasAttribute("aria-label"))
      this.setAttribute("aria-label", "Notifications");
    this.setAttribute("role", "region");
  }

  show({ title, description, tone, duration }: ToastOptions) {
    const item = document.createElement("div");
    item.className = `vs-toast${tone ? ` vs-${tone}` : ""}`;
    item.setAttribute("role", tone === "error" ? "alert" : "status");
    const heading = document.createElement("strong");
    heading.textContent = title;
    item.append(heading);
    if (description) {
      const text = document.createElement("p");
      text.textContent = description;
      item.append(text);
    }
    const close = document.createElement("button");
    close.type = "button";
    close.textContent = "×";
    close.setAttribute(
      "aria-label",
      this.getAttribute("close-label") ?? "Close",
    );
    close.addEventListener("click", () => item.remove());
    item.append(close);
    this.append(item);

    const ms = duration ?? Number(this.getAttribute("duration") ?? 5000);
    if (ms > 0) {
      let timer = window.setTimeout(() => item.remove(), ms);
      const pause = () => window.clearTimeout(timer);
      const resume = () => (timer = window.setTimeout(() => item.remove(), ms));
      item.addEventListener("pointerenter", pause);
      item.addEventListener("pointerleave", resume);
      item.addEventListener("focusin", pause);
      item.addEventListener("focusout", resume);
    }
    return item;
  }
}

define("vs-toaster", VsToaster);

/** Shows a toast in the first <vs-toaster>, creating one on <body> if needed. */
export function toast(options: ToastOptions | string) {
  let host = document.querySelector<VsToaster>("vs-toaster");
  if (!host) {
    host = document.createElement("vs-toaster") as VsToaster;
    document.body.append(host);
  }
  return host.show(typeof options === "string" ? { title: options } : options);
}
