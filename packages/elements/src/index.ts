// Velessoft UI Web Components. Importing this module registers every element. MIT © 2026 villetacore.
import { VsDialog } from "./dialog.js";
import { VsMenu } from "./menu.js";
import { VsPagination } from "./pagination.js";
import { VsTabs } from "./tabs.js";
import { VsThemeToggle } from "./theme.js";
import { VsToaster } from "./toaster.js";
import { VsTooltip } from "./tooltip.js";

export {
  VsDialog,
  VsMenu,
  VsPagination,
  VsTabs,
  VsThemeToggle,
  VsToaster,
  VsTooltip,
};
export { toast, type ToastOptions } from "./toaster.js";
export { setTheme, getTheme, type Theme } from "./theme.js";
export { paginationRange } from "./pagination.js";

declare global {
  interface HTMLElementTagNameMap {
    "vs-dialog": VsDialog;
    "vs-menu": VsMenu;
    "vs-pagination": VsPagination;
    "vs-tabs": VsTabs;
    "vs-theme-toggle": VsThemeToggle;
    "vs-toaster": VsToaster;
    "vs-tooltip": VsTooltip;
  }
}
