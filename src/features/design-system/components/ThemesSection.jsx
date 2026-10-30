import { Check, Moon, Sun } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import {
  THEMES,
  THEME_OPTIONS,
} from "@/constants/theme";
import { useThemeStore } from "@/store/themeStore";
import { cn } from "@/utils/cn";
import { ShowcaseSection } from "./ShowcaseSection";

const themeIcons = {
  [THEMES.LIGHT]: Sun,
  [THEMES.DARK]: Moon,
};

export function ThemesSection() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  return (
    <ShowcaseSection
      id="themes"
      title="Themes"
      description="Light and dark modes share the same component APIs and semantic tokens. The selected theme is persisted and applied before React hydrates to avoid a flash of the wrong theme."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <Card
          title="Choose appearance"
          description="Theme switching applies instantly to every component on this page."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {THEME_OPTIONS.map((option) => {
              const isActive = theme === option.value;
              const Icon = themeIcons[option.value];

              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setTheme(option.value)}
                  className={cn(
                    "rounded-card border p-4 text-left transition-colors focus-visible:outline-offset-2",
                    isActive
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-base-300 bg-base-100 hover:border-base-content/25",
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-sm font-semibold text-base-content">
                      <Icon className="size-4 text-primary" aria-hidden="true" />
                      {option.label}
                    </span>
                    <span
                      className={cn(
                        "flex size-5 items-center justify-center rounded-full border",
                        isActive
                          ? "border-primary bg-primary text-primary-content"
                          : "border-base-300",
                      )}
                    >
                      {isActive ? (
                        <Check className="size-3" aria-hidden="true" />
                      ) : null}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-base-content/55">
                    {option.description}
                  </p>
                  <div className="mt-3 flex gap-1.5" aria-hidden="true">
                    <span className="h-5 flex-1 rounded-sm border border-base-300 bg-base-100" />
                    <span className="h-5 flex-1 rounded-sm bg-base-300" />
                    <span className="h-5 flex-1 rounded-sm bg-primary" />
                    <span className="h-5 flex-1 rounded-sm bg-success" />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex items-center justify-between gap-3 border-t border-base-300 pt-5">
            <span className="text-xs text-base-content/50">Active theme</span>
            <Badge variant="info" size="sm">
              {theme}
            </Badge>
          </div>
        </Card>

        <Card
          title="Persistence and behavior"
          description="Theme state lives in a small Zustand store with localStorage persistence."
        >
          <ul className="space-y-2.5 text-sm text-base-content/65">
            <li className="rounded-control bg-base-200/60 px-3 py-2">
              Stored under the key{" "}
              <code className="font-mono text-xs text-base-content">
                nexus-theme
              </code>
              .
            </li>
            <li className="rounded-control bg-base-200/60 px-3 py-2">
              An inline head script applies the stored theme before the app
              renders.
            </li>
            <li className="rounded-control bg-base-200/60 px-3 py-2">
              All components consume semantic DaisyUI tokens, so no
              component-level overrides are needed.
            </li>
            <li className="rounded-control bg-base-200/60 px-3 py-2">
              The theme toggle in the header uses the same store as this
              section.
            </li>
          </ul>
        </Card>
      </div>
    </ShowcaseSection>
  );
}
