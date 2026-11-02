import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button, Input, Checkbox, Dialog } from "./index";
describe("components", () => {
  it("blocks repeated submission while loading", async () => {
    const click = vi.fn();
    render(
      <Button loading onClick={click}>
        Save
      </Button>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(click).not.toHaveBeenCalled();
    expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
  });
  it("connects field errors and hint to its accessible input", () => {
    render(<Input label="Name" hint="Public name" error="Required" />);
    expect(screen.getByLabelText("Name")).toHaveAccessibleDescription(
      "Public name Required",
    );
    expect(screen.getByLabelText("Name")).toBeInvalid();
  });
  it("toggles checkbox from its label", async () => {
    render(<Checkbox label="Open source" />);
    await userEvent.click(screen.getByText("Open source"));
    expect(screen.getByRole("checkbox")).toBeChecked();
  });
  it("opens controlled dialog and requests closing", async () => {
    const close = vi.fn();
    const { rerender } = render(
      <Dialog open title="New project" onClose={close}>
        Content
      </Dialog>,
    );
    expect(screen.getByRole("dialog")).toHaveAccessibleName("New project");
    await userEvent.click(
      screen.getByRole("button", { name: "Закрыть диалог" }),
    );
    expect(close).toHaveBeenCalledOnce();
    rerender(
      <Dialog open={false} title="New project" onClose={close}>
        Content
      </Dialog>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
