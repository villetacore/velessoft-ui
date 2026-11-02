import { define, emit, ensureId, VsElement } from "./shared.js";

/**
 * <vs-tabs selected="0">
 *   <div role="tablist" aria-label="Project"><button>Overview</button><button>Files</button></div>
 *   <div role="tabpanel">…</div><div role="tabpanel">…</div>
 * </vs-tabs>
 * Emits `vs-change` with `{ index }`.
 */
export class VsTabs extends VsElement {
  static observedAttributes = ["selected"];
  private observer?: MutationObserver;

  get selected() {
    return Number(this.getAttribute("selected") ?? 0) || 0;
  }
  set selected(index: number) {
    this.setAttribute("selected", String(index));
  }

  private get tabs() {
    return Array.from(
      this.querySelectorAll<HTMLButtonElement>(
        ':scope > [role="tablist"] > button, :scope > .vs-tab-list > button',
      ),
    );
  }
  private get panels() {
    return Array.from(
      this.querySelectorAll<HTMLElement>(
        ':scope > [role="tabpanel"], :scope > .vs-tab-panel',
      ),
    );
  }

  connectedCallback() {
    this.classList.add("vs-tabs");
    this.listen(this, "click", (e) => {
      const index = this.tabs.indexOf(
        (e.target as Element).closest("button") as HTMLButtonElement,
      );
      if (index >= 0) this.select(index);
    });
    this.listen(this, "keydown", (e) => {
      const tabs = this.tabs;
      const index = tabs.indexOf(e.target as HTMLButtonElement);
      if (index < 0) return;
      const enabled = tabs
        .map((t, i) => (t.disabled ? -1 : i))
        .filter((i) => i >= 0);
      const pos = enabled.indexOf(index);
      const next = {
        ArrowRight: enabled[(pos + 1) % enabled.length],
        ArrowLeft: enabled[(pos - 1 + enabled.length) % enabled.length],
        Home: enabled[0],
        End: enabled[enabled.length - 1],
      }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      this.select(next);
      tabs[next]?.focus();
    });
    this.observer = new MutationObserver(() => this.sync());
    this.observer.observe(this, { childList: true, subtree: false });
    this.sync();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.observer?.disconnect();
  }
  attributeChangedCallback() {
    this.sync();
  }

  select(index: number) {
    if (index === this.selected || this.tabs[index]?.disabled) return;
    this.selected = index;
    emit(this, "vs-change", { index });
  }

  private sync() {
    const tabs = this.tabs,
      panels = this.panels;
    this.querySelector(
      ':scope > [role="tablist"], :scope > .vs-tab-list',
    )?.classList.add("vs-tab-list");
    this.querySelector(":scope > .vs-tab-list")?.setAttribute(
      "role",
      "tablist",
    );
    tabs.forEach((tab, i) => {
      const panel = panels[i];
      const active = i === this.selected;
      tab.type = "button";
      tab.classList.add("vs-tab");
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      if (panel) {
        tab.setAttribute("aria-controls", ensureId(panel, "vs-panel"));
        panel.setAttribute("aria-labelledby", ensureId(tab, "vs-tab"));
      }
    });
    panels.forEach((panel, i) => {
      panel.classList.add("vs-tab-panel");
      panel.setAttribute("role", "tabpanel");
      panel.tabIndex = 0;
      panel.hidden = i !== this.selected;
    });
  }
}

define("vs-tabs", VsTabs);
