import { define, emit, VsElement } from "./shared.js";

/**
 * Controls a native <dialog class="vs-dialog"> child.
 * <vs-dialog open><dialog class="vs-dialog" aria-labelledby="t">…<button data-close>×</button></dialog></vs-dialog>
 * Toggle the `open` attribute/property. Escape, `[data-close]` buttons and (with `close-on-backdrop`)
 * backdrop clicks emit a cancelable `vs-close`; unless prevented, the dialog closes.
 */
export class VsDialog extends VsElement {
  static observedAttributes = ["open"];
  private previous: HTMLElement | null = null;

  get open() {
    return this.hasAttribute("open");
  }
  set open(value: boolean) {
    this.toggleAttribute("open", value);
  }
  get dialog() {
    return this.querySelector<HTMLDialogElement>(":scope > dialog");
  }

  show() {
    this.open = true;
  }
  close() {
    this.open = false;
  }

  connectedCallback() {
    const dialog = this.dialog;
    if (!dialog) return;
    dialog.classList.add("vs-dialog");
    this.listen(dialog, "cancel", (e) => {
      e.preventDefault();
      this.requestClose("escape");
    });
    this.listen(dialog, "click", (e) => {
      const target = e.target as Element;
      if (target.closest("[data-close]")) return this.requestClose("button");
      if (target !== dialog || !this.hasAttribute("close-on-backdrop")) return;
      const r = dialog.getBoundingClientRect();
      const inside =
        e.clientX >= r.left &&
        e.clientX <= r.right &&
        e.clientY >= r.top &&
        e.clientY <= r.bottom;
      if (!inside) this.requestClose("backdrop");
    });
    this.sync();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.dialog?.open) this.dialog.close();
  }
  attributeChangedCallback() {
    this.sync();
  }

  private requestClose(reason: string) {
    if (emit(this, "vs-close", { reason }, true)) this.close();
  }

  private sync() {
    const dialog = this.dialog;
    if (!dialog || !this.isConnected) return;
    if (this.open && !dialog.open) {
      this.previous = document.activeElement as HTMLElement | null;
      dialog.showModal();
      emit(this, "vs-open", {});
    } else if (!this.open && dialog.open) {
      dialog.close();
      this.previous?.focus();
    }
  }
}

define("vs-dialog", VsDialog);
