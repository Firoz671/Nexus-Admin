import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { THEME_STORAGE_KEY, THEMES } from "@/constants/theme";
import { useThemeStore } from "@/store/themeStore";

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    useThemeStore.setState({ theme: THEMES.LIGHT });
    document.documentElement.removeAttribute("data-theme");
  });

  it("switches between light and dark themes and persists the choice", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(
      screen.getByRole("button", { name: "Switch to dark theme" }),
    );

    expect(useThemeStore.getState().theme).toBe(THEMES.DARK);
    expect(document.documentElement).toHaveAttribute(
      "data-theme",
      THEMES.DARK,
    );
    expect(JSON.parse(localStorage.getItem(THEME_STORAGE_KEY)).state.theme).toBe(
      THEMES.DARK,
    );
    expect(
      screen.getByRole("button", { name: "Switch to light theme" }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Switch to light theme" }),
    );

    expect(useThemeStore.getState().theme).toBe(THEMES.LIGHT);
    expect(document.documentElement).toHaveAttribute(
      "data-theme",
      THEMES.LIGHT,
    );
  });
});
