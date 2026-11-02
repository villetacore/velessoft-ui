import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { toast } from "./index";

const mount = (html: string) => {
  document.body.innerHTML = html;
  return document.body.firstElementChild as HTMLElement;
};

describe("web components", () => {
  it("vs-tabs wires roles and switches with keyboard", async () => {
    const el = mount(`<vs-tabs>
      <div role="tablist" aria-label="Project"><button>One</button><button>Two</button></div>
      <div role="tabpanel">First</div><div role="tabpanel">Second</div>
    </vs-tabs>`);
    const change = vi.fn();
    el.addEventListener("vs-change", (e) => change((e as CustomEvent).detail));
    const one = screen.getByRole("tab", { name: "One" });
    expect(one).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("First");
    one.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveFocus();
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Second");
    expect(change).toHaveBeenCalledWith({ index: 1 });
  });

  it("vs-dialog opens from the attribute and closes from data-close", async () => {
    const el = mount(
      `<vs-dialog><dialog aria-label="Settings"><button data-close>Close</button></dialog></vs-dialog>`,
    );
    el.setAttribute("open", "");
    expect(
      screen.getByRole("dialog", { name: "Settings" }),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByText("Close"));
    expect(el).not.toHaveAttribute("open");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("vs-dialog close can be prevented", async () => {
    const el = mount(
      `<vs-dialog open><dialog aria-label="Edit"><button data-close>Close</button></dialog></vs-dialog>`,
    );
    el.addEventListener("vs-close", (e) => e.preventDefault());
    await userEvent.click(screen.getByText("Close"));
    expect(el).toHaveAttribute("open");
  });

  it("vs-menu opens, navigates and emits selection", async () => {
    const el = mount(`<vs-menu><button>Actions</button>
      <div class="vs-menu"><button data-value="edit">Edit</button><hr><button data-value="delete">Delete</button></div></vs-menu>`);
    const select = vi.fn();
    el.addEventListener("vs-select", (e) =>
      select((e as CustomEvent).detail.value),
    );
    const trigger = screen.getByRole("button", { name: "Actions" });
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(select).toHaveBeenCalledWith("delete");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("vs-tooltip describes its trigger", async () => {
    mount(
      `<vs-tooltip text="Copies the link"><button>Copy</button></vs-tooltip>`,
    );
    expect(
      screen.getByRole("button", { name: "Copy" }),
    ).toHaveAccessibleDescription("Copies the link");
    await userEvent.tab();
    await vi.waitFor(() =>
      expect(screen.getByRole("tooltip", { hidden: true })).toBeVisible(),
    );
  });

  it("vs-pagination renders pages and emits changes", async () => {
    const el = mount(`<vs-pagination page="1" count="10"></vs-pagination>`);
    const change = vi.fn();
    el.addEventListener("vs-change", (e) =>
      change((e as CustomEvent).detail.page),
    );
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(change).toHaveBeenCalledWith(2);
    expect(screen.getByRole("button", { name: "Page 2" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("toast() creates a toaster and a closable toast", async () => {
    document.body.innerHTML = "";
    toast({ title: "Saved", tone: "success", duration: 0 });
    expect(screen.getByRole("status")).toHaveTextContent("Saved");
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("vs-theme-toggle switches the document theme", async () => {
    document.documentElement.dataset.theme = "light";
    mount(`<vs-theme-toggle><button>Theme</button></vs-theme-toggle>`);
    await userEvent.click(screen.getByRole("button", { name: "Theme" }));
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(screen.getByRole("button", { name: "Theme" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
