import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

function Welcome() {
  return <h1>Nexus Admin</h1>;
}

describe("Welcome Component", () => {
  it("should render the application title", () => {
    render(<Welcome />);

    expect(
      screen.getByRole("heading", { name: "Nexus Admin" }),
    ).toBeInTheDocument();
  });
});
