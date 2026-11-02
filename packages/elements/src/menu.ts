import {
  define,
  emit,
  ensureId,
  placeFloating,
  trackPlacement,
  VsElement,
} from "./shared.js";

/**
 * <vs-menu>
 *   <button class="vs-button">Actions</button>
 *   <div class="vs-menu"><button data-value="edit">Edit</button><hr><button data-value="delete">Delete</button></div>
 * </vs-menu>
 * Emits `vs-select` with `{ value, item }`.
 */
export class VsMenu extends VsElement {
  private untrack?: () => void;
  private get trigger() {
    return this.querySelector<HTMLButtonElement>(
      ":scope > button, :scope > [data-menu-trigger]",
    );
  }
  private get list() {
    return this.querySelector<HTMLElement>(
      ':scope > .vs-menu, :scope > [role="menu"]',
    );
  }
  private get items() {
    return Array.from(
      this.list?.querySelectorAll<HTMLElement>(
        ':scope > button:not(:disabled), :scope > a, :scope > [role="menuitem"]',
      ) ?? [],
    );
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.untrack?.();
  }
  get expanded() {
    return this.trigger?.getAttribute("aria-expanded") === "true";
  }

  connectedCallback() {
    const trigger = this.trigger,
      list = this.list;
    if (!trigger || !list) return;
    this.classList.add("vs-menu-anchor");
    list.classList.add("vs-menu");
    list.setAttribute("role", "menu");
    list.hidden = true;
    trigger.setAttribute("aria-haspopup", "menu");
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-controls", ensureId(list, "vs-menu"));
    list.querySelectorAll(":scope > hr").forEach((hr) => {
      hr.classList.add("vs-menu-separator");
      hr.setAttribute("role", "separator");
    });
    this.items.forEach((item) => {
      item.classList.add("vs-menu-item");
      item.setAttribute("role", "menuitem");
      item.tabIndex = -1;
    });
    this.listen(trigger, "click", () =>
      this.expanded ? this.hide() : this.show(),
    );
    this.listen(trigger, "keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        this.show(e.key === "ArrowUp" ? "last" : "first");
      }
    });
    this.listen(list, "click", (e) => {
      const item = (e.target as Element).closest<HTMLElement>(
        '[role="menuitem"]',
      );
      if (!item || (item as HTMLButtonElement).disabled) return;
      emit(this, "vs-select", {
        value: item.dataset.value ?? item.textContent?.trim(),
        item,
      });
      this.hide();
    });
    this.listen(list, "keydown", (e) => {
      const items = this.items;
      const i = items.indexOf(document.activeElement as HTMLElement);
      const next = {
        ArrowDown: i + 1,
        ArrowUp: i - 1,
        Home: 0,
        End: items.length - 1,
      }[e.key];
      if (next !== undefined) {
        e.preventDefault();
        items[(next + items.length) % items.length]?.focus();
      } else if (e.key === "Tab") this.hide(false);
    });
    this.listen(
      document,
      "keydown",
      (e) => e.key === "Escape" && this.expanded && this.hide(),
    );
    this.listen(document, "mousedown", (e) => {
      if (this.expanded && !this.contains(e.target as Node)) this.hide(false);
    });
  }

  show(focus: "first" | "last" = "first") {
    const list = this.list;
    if (!list) return;
    list.hidden = false;
    this.trigger?.setAttribute("aria-expanded", "true");
    const trigger = this.trigger!;
    const align = list.dataset.align === "end" ? "end" : "start";
    this.untrack?.();
    this.untrack = trackPlacement(() => placeFloating(trigger, list, align));
    const items = this.items;
    (focus === "first" ? items[0] : items[items.length - 1])?.focus();
  }
  hide(refocus = true) {
    this.untrack?.();
    this.untrack = undefined;
    if (this.list) this.list.hidden = true;
    this.trigger?.setAttribute("aria-expanded", "false");
    if (refocus) this.trigger?.focus();
  }
}

define("vs-menu", VsMenu);
