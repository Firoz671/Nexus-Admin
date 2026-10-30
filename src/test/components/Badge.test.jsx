import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/Badge";

describe("Badge", () => {
  it.each([
    ["success", "bg-success"],
    ["warning", "bg-warning"],
    ["danger", "bg-error"],
    ["info", "bg-info"],
    ["neutral", "bg-neutral"],
  ])("renders the %s variant with its semantic color", (variant, className) => {
    render(<Badge variant={variant}>{variant}</Badge>);

    expect(screen.getByText(variant)).toHaveClass(className);
  });
});
