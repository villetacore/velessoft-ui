import { define, uid, VsElement } from "./shared.js";

/**
 * <vs-tooltip text="Copy link" placement="top"><button class="vs-button">⧉</button></vs-tooltip>
 * Shows on hover (after `delay` ms, default 300) and on focus; Escape hides it.
 */
export class VsTooltip extends VsElement {
  static observedAttributes = ["text", "placement"];
  private bubble = document.createElement("span");
  private timer?: number;

  connectedCallback() {
    this.classList.add("vs-tooltip-anchor");
    const bubble = this.bubble;
    bubble.id ||= uid("vs-tooltip");
    bubble.className = "vs-tooltip";
    bubble.setAttribute("role", "tooltip");
    bubble.hidden = true;
    this.append(bubble);
    this.target?.setAttribute(
      "aria-describedby",
      [this.target.getAttribute("aria-describedby"), bubble.id]
        .filter(Boolean)
        .join(" "),
    );
    this.attributeChangedCallback();
    const delay = () => Number(this.getAttribute("delay") ?? 300);
    this.listen(this, "pointerenter", () => this.show(delay()));
    this.listen(this, "pointerleave", () => this.hide());
    this.listen(this, "focusin", () => this.show(0));
    this.listen(this, "focusout", () => this.hide());
    this.listen(document, "keydown", (e) => e.key === "Escape" && this.hide());
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.clearTimeout(this.timer);
    this.bubble.remove();
  }
  attributeChangedCallback() {
    this.bubble.textContent = this.getAttribute("text") ?? "";
    this.bubble.dataset.placement = this.getAttribute("placement") ?? "top";
  }

  private get target() {
    return Array.from(this.children).find((el) => el !== this.bubble) as
      HTMLElement | undefined;
  }
  show(wait = 0) {
    window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => (this.bubble.hidden = false), wait);
  }
  hide() {
    window.clearTimeout(this.timer);
    this.bubble.hidden = true;
  }
}

define("vs-tooltip", VsTooltip);
