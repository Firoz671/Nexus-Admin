import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { App } from "@/app/App";
import { THEMES } from "@/constants/theme";
import { useThemeStore } from "@/store/themeStore";

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
    useThemeStore.setState({ theme: THEMES.LIGHT });
    window.history.replaceState({}, "", "/");
  });

  it("redirects the root route to the design system showcase", async () => {
    render(<App />);

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Nexus Admin design system",
      }),
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe("/design-system");
    expect(
      screen.getByRole("heading", { level: 2, name: "Color system" }),
    ).toBeInTheDocument();
  });
});
