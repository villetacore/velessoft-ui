import React, { useState } from "react";
import { it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  SearchInput,
  PasswordInput,
  CopyButton,
  Stepper,
  DescriptionList,
} from "./index.js";
it("clears a controlled search and returns focus without submitting", async () => {
  const submit = vi.fn();
  function App() {
    const [value, setValue] = useState("hello");
    return (
      <form onSubmit={submit}>
        <SearchInput
          label="Search"
          clearLabel="Clear"
          value={value}
          onValueChange={setValue}
        />
      </form>
    );
  }
  render(<App />);
  await userEvent.click(screen.getByRole("button", { name: "Clear" }));
  expect(screen.getByRole("searchbox")).toHaveValue("");
  expect(screen.getByRole("searchbox")).toHaveFocus();
  expect(submit).not.toHaveBeenCalled();
});
it("respects disabled and readonly search", () => {
  const { rerender } = render(
    <SearchInput label="Search" clearLabel="Clear" defaultValue="x" disabled />,
  );
  expect(screen.getByRole("button")).toBeDisabled();
  rerender(
    <SearchInput label="Search" clearLabel="Clear" defaultValue="x" readOnly />,
  );
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});
it("toggles password without changing its value and forwards error description", async () => {
  render(
    <PasswordInput
      label="Password"
      showLabel="Show"
      hideLabel="Hide"
      defaultValue="secret"
      error="Too short"
    />,
  );
  expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
  await userEvent.click(screen.getByRole("button", { name: "Show" }));
  expect(screen.getByLabelText("Password")).toHaveAttribute("type", "text");
  expect(screen.getByLabelText("Password")).toHaveValue("secret");
  expect(screen.getByLabelText("Password")).toHaveAccessibleDescription(
    "Too short",
  );
  await userEvent.click(screen.getByRole("button", { name: "Hide" }));
  expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
});
it("copies and announces success", async () => {
  const user = userEvent.setup();
  const write = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
  render(
    <CopyButton
      value="npm install"
      label="Copy"
      copiedLabel="Copied"
      errorLabel="Failed"
    />,
  );
  await user.click(screen.getByRole("button"));
  expect(write).toHaveBeenCalledWith("npm install");
  expect(screen.getByRole("status")).toHaveTextContent("Copied");
  write.mockRestore();
});
it("reports denied clipboard access without false success", async () => {
  const user = userEvent.setup();
  const write = vi
    .spyOn(navigator.clipboard, "writeText")
    .mockRejectedValue(new Error("Denied"));
  render(
    <CopyButton
      value="x"
      label="Copy"
      copiedLabel="Copied"
      errorLabel="Failed"
    />,
  );
  await user.click(screen.getByRole("button"));
  expect(screen.getByRole("status")).toHaveTextContent("Failed");
  write.mockRestore();
});
it("marks current step and permits keyboard navigation without enabling disabled steps", async () => {
  const change = vi.fn();
  render(
    <Stepper
      label="Setup"
      current="a"
      onStepChange={change}
      items={[
        { id: "a", label: "Account" },
        { id: "b", label: "Billing", disabled: true },
      ]}
    />,
  );
  expect(screen.getByText("Account").closest("li")).toHaveAttribute(
    "aria-current",
    "step",
  );
  screen.getByRole("button", { name: "Account" }).focus();
  await userEvent.keyboard("{Enter}");
  expect(change).toHaveBeenCalledWith("a");
  expect(screen.getByRole("button", { name: "Billing" })).toBeDisabled();
});
it("renders semantic description terms and values", () => {
  render(
    <DescriptionList
      items={[{ id: "owner", term: "Owner", description: "villetacore" }]}
    />,
  );
  expect(screen.getByRole("term")).toHaveTextContent("Owner");
  expect(screen.getByRole("definition")).toHaveTextContent("villetacore");
});
