import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { THEMES } from "@/constants/theme";
import { useThemeStore } from "@/store/themeStore";

export function ThemeToggle({ className }) {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const isDark = theme === THEMES.DARK;
  const nextTheme = isDark ? "light" : "dark";

  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label={`Switch to ${nextTheme} theme`}
      title={`Switch to ${nextTheme} theme`}
      onClick={toggleTheme}
      leftIcon={isDark ? <Sun /> : <Moon />}
      className={className}
    >
      <span className="hidden sm:inline">{isDark ? "Light" : "Dark"}</span>
    </Button>
  );
}
