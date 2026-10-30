import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "@/components/ui/Input";

describe("Input", () => {
  it("accepts user input through its accessible label", async () => {
    const user = userEvent.setup();

    render(
      <Input
        label="Work email"
        placeholder="you@company.com"
        helperText="Use your company email address."
      />,
    );

    const input = screen.getByLabelText("Work email");

    await user.type(input, "ada@nexus.dev");

    expect(input).toHaveValue("ada@nexus.dev");
    expect(input).toHaveAccessibleDescription(
      "Use your company email address.",
    );
  });

  it("displays validation errors and links them to the field", () => {
    render(
      <Input
        label="Work email"
        error="Enter a valid work email address."
      />,
    );

    const input = screen.getByLabelText("Work email");

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription(
      "Enter a valid work email address.",
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Enter a valid work email address.",
    );
  });
});
