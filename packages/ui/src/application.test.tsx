import React, { useState } from "react";
import { it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  NumberInput,
  DateInput,
  TimeInput,
  FileInput,
  MultiSelect,
  Toggle,
  ToggleGroup,
  Collapsible,
  Timeline,
  Toolbar,
  PageHeader,
  NavList,
  CodeBlock,
} from "./index.js";
it("preserves native number constraints, labels and errors", () => {
  render(
    <NumberInput label="Count" min={1} max={10} step={2} error="Invalid" />,
  );
  const el = screen.getByRole("spinbutton");
  expect(el).toHaveAttribute("min", "1");
  expect(el).toHaveAttribute("max", "10");
  expect(el).toHaveAccessibleDescription("Invalid");
});
it("retains date/time string values without timezone changes", () => {
  render(
    <>
      <DateInput label="Date" defaultValue="2026-11-02" />
      <TimeInput label="Time" defaultValue="09:30" />
    </>,
  );
  expect(screen.getByLabelText("Date")).toHaveValue("2026-11-02");
  expect(screen.getByLabelText("Time")).toHaveValue("09:30");
});
it("reports selected files without uploading", async () => {
  const onFiles = vi.fn();
  render(<FileInput label="Upload" multiple onFilesChange={onFiles} />);
  const f = new File(["hello"], "hello.txt", { type: "text/plain" });
  await userEvent.upload(screen.getByLabelText("Upload"), f);
  expect(onFiles).toHaveBeenCalledWith([f]);
});
it("keeps filtered-out selections in form data and handles empty search", async () => {
  function Demo() {
    const [value, setValue] = useState(["a"]);
    return (
      <form aria-label="Form">
        <MultiSelect
          label="Members"
          options={[
            { value: "a", label: "Alice" },
            { value: "b", label: "Bob" },
          ]}
          value={value}
          onValueChange={setValue}
          searchLabel="Find"
          emptyText="No matches"
          name="members"
        />
      </form>
    );
  }
  render(<Demo />);
  await userEvent.type(screen.getByRole("searchbox"), "Bob");
  await userEvent.click(screen.getByLabelText("Bob"));
  expect(
    new FormData(screen.getByRole("form") as HTMLFormElement).getAll("members"),
  ).toEqual(["a", "b"]);
  await userEvent.clear(screen.getByRole("searchbox"));
  await userEvent.type(screen.getByRole("searchbox"), "ZZZ");
  expect(screen.getByRole("status")).toHaveTextContent("No matches");
});
it("honors disabled multiselect options and group", () => {
  render(
    <MultiSelect
      disabled
      label="Roles"
      options={[{ value: "a", label: "Admin" }]}
      searchLabel="Find"
      emptyText="Empty"
    />,
  );
  expect(screen.getByRole("checkbox")).toBeDisabled();
  expect(screen.getByRole("searchbox")).toBeDisabled();
});
it("toggles with keyboard and never submits parent form", async () => {
  const submit = vi.fn();
  render(
    <form onSubmit={submit}>
      <Toggle>Bold</Toggle>
    </form>,
  );
  screen.getByRole("button").focus();
  await userEvent.keyboard(" ");
  expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  expect(submit).not.toHaveBeenCalled();
});
it("supports controlled multiple toggles", async () => {
  const changed = vi.fn();
  render(
    <ToggleGroup
      label="Style"
      value={["bold"]}
      onValueChange={changed}
      options={[
        { value: "bold", label: "Bold" },
        { value: "italic", label: "Italic" },
      ]}
    />,
  );
  await userEvent.click(screen.getByRole("button", { name: "Italic" }));
  expect(changed).toHaveBeenCalledWith(["bold", "italic"]);
});
it("collapses content with linked disclosure state", async () => {
  render(<Collapsible title="Advanced">Options</Collapsible>);
  expect(screen.getByText("Options")).not.toBeVisible();
  const b = screen.getByRole("button");
  await userEvent.click(b);
  expect(b).toHaveAttribute("aria-expanded", "true");
  expect(
    document.getElementById(b.getAttribute("aria-controls")!),
  ).toBeVisible();
  await userEvent.keyboard("{Enter}");
  expect(screen.getByText("Options")).not.toBeVisible();
});
it("controlled disclosure waits for parent", async () => {
  const change = vi.fn();
  render(
    <Collapsible title="Advanced" open={false} onOpenChange={change}>
      Options
    </Collapsible>,
  );
  await userEvent.click(screen.getByRole("button"));
  expect(change).toHaveBeenCalledWith(true);
  expect(screen.getByText("Options")).not.toBeVisible();
});
it("renders timeline timestamps semantically", () => {
  render(
    <Timeline
      label="History"
      items={[
        { id: "a", title: "Created", time: "Today", dateTime: "2026-11-02" },
      ]}
    />,
  );
  expect(screen.getByRole("list")).toHaveAccessibleName("History");
  expect(screen.getByText("Today").tagName).toBe("TIME");
});
it("renders page hierarchy and current navigation", () => {
  render(
    <>
      <PageHeader title="Settings" description="Manage project" level={2} />
      <NavList
        label="Project"
        current="settings"
        items={[
          { id: "settings", label: "Settings", href: "#settings", badge: 0 },
        ]}
      />
      <Toolbar label="Actions">
        <button>Save</button>
      </Toolbar>
    </>,
  );
  expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
    "Settings",
  );
  expect(screen.getByRole("link")).toHaveAttribute("aria-current", "page");
  expect(screen.getByRole("group")).toHaveAccessibleName("Actions");
});
it("code blocks render markup as text, never executable HTML", () => {
  render(
    <CodeBlock
      code={"<img src=x onerror=alert(1)>"}
      label="Code"
      copyLabel="Copy"
      copiedLabel="Copied"
      errorLabel="Failed"
    />,
  );
  expect(screen.getByText("<img src=x onerror=alert(1)>")).toBeInTheDocument();
  expect(screen.queryByRole("img")).not.toBeInTheDocument();
});
