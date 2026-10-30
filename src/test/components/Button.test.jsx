import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("renders its label with the primary variant", () => {
    render(<Button>Save changes</Button>);

    const button = screen.getByRole("button", { name: "Save changes" });

    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("btn", "btn-primary");
    expect(button).not.toBeDisabled();
  });

  it("does not fire click handlers when disabled", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Button disabled onClick={handleClick}>
        Save changes
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Save changes" });

    await user.click(button);

    expect(button).toBeDisabled();
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("exposes a busy, disabled state while loading", () => {
    render(<Button loading>Processing</Button>);

    const button = screen.getByRole("button", { name: "Processing" });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });
});
