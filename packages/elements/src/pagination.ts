import { define, emit, VsElement } from "./shared.js";

/** Page numbers with ellipses, e.g. 1 … 4 5 6 … 20. */
export function paginationRange(page: number, count: number, siblings = 1) {
  const pages: (number | "gap")[] = [1];
  const start = Math.max(2, page - siblings);
  const end = Math.min(count - 1, page + siblings);
  if (start > 2) pages.push(start === 3 ? 2 : "gap");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < count - 1) pages.push(end === count - 2 ? count - 1 : "gap");
  if (count > 1) pages.push(count);
  return pages;
}

/**
 * <vs-pagination page="1" count="12" label="Pages"></vs-pagination>
 * Emits `vs-change` with `{ page }` and updates its own `page` attribute.
 * The element owns its children; render it empty.
 */
export class VsPagination extends VsElement {
  static observedAttributes = ["page", "count", "siblings", "label"];

  get page() {
    return Math.max(1, Number(this.getAttribute("page") ?? 1) || 1);
  }
  set page(value: number) {
    this.setAttribute("page", String(value));
  }
  get count() {
    return Math.max(1, Number(this.getAttribute("count") ?? 1) || 1);
  }

  connectedCallback() {
    this.listen(this, "click", (e) => {
      const button = (e.target as Element).closest<HTMLButtonElement>(
        "button[data-page]",
      );
      if (!button || button.disabled) return;
      const page = Number(button.dataset.page);
      if (page === this.page) return;
      this.page = page;
      emit(this, "vs-change", { page });
      this.querySelector<HTMLButtonElement>(
        'button[aria-current="page"]',
      )?.focus();
    });
    this.render();
  }
  attributeChangedCallback() {
    if (this.isConnected) this.render();
  }

  private render() {
    const page = Math.min(this.page, this.count),
      count = this.count;
    const nav = document.createElement("nav");
    nav.className = "vs-pagination";
    nav.setAttribute("aria-label", this.getAttribute("label") ?? "Pagination");
    const ul = document.createElement("ul");
    const pageLabel = (p: number) =>
      (this.getAttribute("page-label") ?? "Page {page}").replace(
        "{page}",
        String(p),
      );
    const button = (
      target: number,
      text: string,
      label: string,
      disabled = false,
      isPage = false,
    ) => {
      const li = document.createElement("li");
      const b = document.createElement("button");
      b.type = "button";
      b.dataset.page = String(target);
      b.textContent = text;
      b.disabled = disabled;
      b.setAttribute("aria-label", label);
      if (isPage && target === page) b.setAttribute("aria-current", "page");
      li.append(b);
      ul.append(li);
    };
    button(
      page - 1,
      "←",
      this.getAttribute("previous-label") ?? "Previous",
      page <= 1,
    );
    for (const p of paginationRange(
      page,
      count,
      Number(this.getAttribute("siblings") ?? 1),
    )) {
      if (p === "gap") {
        const li = document.createElement("li");
        li.innerHTML = '<span class="vs-ellipsis" aria-hidden="true">…</span>';
        ul.append(li);
      } else button(p, String(p), pageLabel(p), false, true);
    }
    button(
      page + 1,
      "→",
      this.getAttribute("next-label") ?? "Next",
      page >= count,
    );
    nav.append(ul);
    this.replaceChildren(nav);
  }
}

define("vs-pagination", VsPagination);
