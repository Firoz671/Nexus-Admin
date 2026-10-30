import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dropdown } from "@/components/ui/Dropdown";

const items = [
  { id: "edit", label: "Edit project", onSelect: vi.fn() },
  { id: "archive", label: "Archive project", onSelect: vi.fn() },
];

describe("Dropdown", () => {
  it("opens, exposes menu items, and closes on selection", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(
      <Dropdown
        trigger="Project actions"
        items={[
          { id: "edit", label: "Edit project", onSelect: handleSelect },
        ]}
      />,
    );

    const trigger = screen.getByRole("button", { name: "Project actions" });

    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menu")).toBeInTheDocument();

    await user.click(screen.getByRole("menuitem", { name: "Edit project" }));

    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("closes with Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();

    render(<Dropdown trigger="Project actions" items={items} />);

    const trigger = screen.getByRole("button", { name: "Project actions" });

    await user.click(trigger);
    expect(screen.getByRole("menu")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
