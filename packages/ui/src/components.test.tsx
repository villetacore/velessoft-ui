import React, { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Accordion,
  Avatar,
  Breadcrumbs,
  Button,
  Drawer,
  en,
  Menu,
  Pagination,
  paginationRange,
  Progress,
  RadioGroup,
  SegmentedControl,
  Slider,
  Switch,
  Table,
  Tabs,
  Tag,
  ToastProvider,
  Tooltip,
  useToast,
  VelessoftProvider,
} from "./index";

describe("fields", () => {
  it("switch exposes the switch role and toggles", async () => {
    render(<Switch label="Notifications" />);
    const control = screen.getByRole("switch", { name: "Notifications" });
    await userEvent.click(control);
    expect(control).toBeChecked();
  });
  it("radio group selects one value and reports it", async () => {
    const change = vi.fn();
    render(
      <RadioGroup
        label="Plan"
        hint="Billed monthly"
        onChange={change}
        options={[
          { value: "free", label: "Free" },
          { value: "pro", label: "Pro" },
        ]}
      />,
    );
    expect(
      screen.getByRole("group", { name: "Plan" }),
    ).toHaveAccessibleDescription("Billed monthly");
    await userEvent.click(screen.getByLabelText("Pro"));
    expect(change).toHaveBeenCalledWith("pro");
    expect(screen.getByLabelText("Pro")).toBeChecked();
  });
  it("slider shows its formatted value", () => {
    render(
      <Slider label="Volume" defaultValue={40} formatValue={(v) => `${v}%`} />,
    );
    expect(screen.getByRole("slider", { name: "Volume" })).toHaveAttribute(
      "aria-valuetext",
      "40%",
    );
    expect(screen.getByText("40%")).toBeInTheDocument();
  });
});

describe("feedback", () => {
  it("progress reports its value", () => {
    render(<Progress label="Upload" value={30} />);
    expect(screen.getByRole("progressbar", { name: "Upload" })).toHaveAttribute(
      "aria-valuenow",
      "30",
    );
    expect(screen.getByText("30%")).toBeInTheDocument();
  });
  it("tag remove button is labelled", async () => {
    const remove = vi.fn();
    render(<Tag onRemove={remove}>react</Tag>);
    await userEvent.click(
      screen.getByRole("button", { name: "Удалить react" }),
    );
    expect(remove).toHaveBeenCalledOnce();
  });
  it("toasts appear, close and auto-dismiss", async () => {
    vi.useFakeTimers();
    function Demo() {
      const { toast } = useToast();
      return (
        <button onClick={() => toast({ title: "Saved", duration: 1000 })}>
          Go
        </button>
      );
    }
    render(
      <VelessoftProvider messages={en}>
        <ToastProvider>
          <Demo />
        </ToastProvider>
      </VelessoftProvider>,
    );
    act(() => screen.getByText("Go").click());
    expect(screen.getByRole("status")).toHaveTextContent("Saved");
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.queryByText("Saved")).not.toBeInTheDocument();
    vi.useRealTimers();
  });
});

describe("navigation", () => {
  it("tabs switch panels with arrow keys", async () => {
    render(
      <Tabs
        label="Project"
        items={[
          { value: "a", label: "Overview", content: "Overview panel" },
          { value: "b", label: "Files", content: "Files panel" },
        ]}
      />,
    );
    const first = screen.getByRole("tab", { name: "Overview" });
    expect(first).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Overview panel");
    first.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Files" })).toHaveFocus();
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Files panel");
  });
  it("segmented control is a radio group", async () => {
    const change = vi.fn();
    render(
      <SegmentedControl
        label="View"
        onChange={change}
        options={[
          { value: "list", label: "List" },
          { value: "grid", label: "Grid" },
        ]}
      />,
    );
    await userEvent.click(screen.getByLabelText("Grid"));
    expect(change).toHaveBeenCalledWith("grid");
  });
  it("breadcrumbs mark the current page", () => {
    render(
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Settings" }]}
      />,
    );
    expect(screen.getByText("Settings")).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/",
    );
  });
  it("pagination range collapses with gaps", () => {
    expect(paginationRange(1, 3)).toEqual([1, 2, 3]);
    expect(paginationRange(10, 20)).toEqual([1, "gap", 9, 10, 11, "gap", 20]);
    expect(paginationRange(3, 20)).toEqual([1, 2, 3, 4, "gap", 20]);
  });
  it("pagination navigates", async () => {
    function Demo() {
      const [page, setPage] = useState(1);
      return <Pagination page={page} pageCount={5} onPageChange={setPage} />;
    }
    render(
      <VelessoftProvider messages={en}>
        <Demo />
      </VelessoftProvider>,
    );
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByRole("button", { name: "Page 2" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});

describe("overlays", () => {
  it("menu opens, moves focus and selects", async () => {
    const edit = vi.fn();
    render(
      <Menu
        label="Actions"
        items={[
          { label: "Edit", onSelect: edit },
          { type: "separator" },
          { label: "Delete", danger: true },
        ]}
      />,
    );
    const trigger = screen.getByRole("button", { name: "Actions" });
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(edit).toHaveBeenCalledOnce();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });
  it("menu closes on Escape", async () => {
    render(<Menu label="More" items={[{ label: "Copy" }]} />);
    await userEvent.click(screen.getByRole("button", { name: "More" }));
    await userEvent.keyboard("{Escape}");
    expect(screen.getByRole("button", { name: "More" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
  it("tooltip describes its trigger on focus", async () => {
    render(
      <Tooltip content="Copies the link">
        <Button>Copy</Button>
      </Tooltip>,
    );
    await userEvent.tab();
    expect(
      screen.getByRole("button", { name: "Copy" }),
    ).toHaveAccessibleDescription("Copies the link");
    expect(await screen.findByRole("tooltip")).toBeVisible();
  });
  it("drawer is a labelled dialog", () => {
    render(
      <Drawer open title="Filters" onClose={() => {}}>
        Body
      </Drawer>,
    );
    expect(screen.getByRole("dialog")).toHaveAccessibleName("Filters");
    expect(screen.getByRole("dialog")).toHaveClass("vs-drawer");
  });
});

describe("display", () => {
  it("table sorts by a sortable column", async () => {
    render(
      <Table
        rowKey={(r) => r.name}
        columns={[
          { key: "name", header: "Name", sortValue: (r) => r.name },
          { key: "stars", header: "Stars", align: "right" },
        ]}
        rows={[
          { name: "beta", stars: 2 },
          { name: "alpha", stars: 5 },
        ]}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /Name/ }));
    const rows = screen.getAllByRole("row");
    expect(within(rows[1]!).getByText("alpha")).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /Name/ })).toHaveAttribute(
      "aria-sort",
      "ascending",
    );
  });
  it("table shows empty text", () => {
    render(
      <Table
        rowKey={(_, i) => i}
        columns={[{ key: "a", header: "A" }]}
        rows={[]}
        emptyText="Nothing yet"
      />,
    );
    expect(screen.getByText("Nothing yet")).toBeInTheDocument();
  });
  it("avatar falls back to initials", () => {
    render(<Avatar name="Villeta Core" />);
    expect(screen.getByRole("img", { name: "Villeta Core" })).toHaveTextContent(
      "VC",
    );
  });
  it("accordion uses native details", async () => {
    render(
      <Accordion
        items={[{ title: "What is it?", content: "A design system" }]}
      />,
    );
    await userEvent.click(screen.getByText("What is it?"));
    expect(
      screen.getByText("A design system").closest("details"),
    ).toHaveAttribute("open");
  });
});
