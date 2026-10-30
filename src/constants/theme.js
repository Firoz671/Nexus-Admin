export const THEMES = Object.freeze({
  LIGHT: "nexus-light",
  DARK: "nexus-dark",
});

export const THEME_VALUES = Object.freeze(Object.values(THEMES));

export const DEFAULT_THEME = THEMES.LIGHT;

export const THEME_STORAGE_KEY = "nexus-theme";

export const THEME_OPTIONS = Object.freeze([
  {
    value: THEMES.LIGHT,
    label: "Light",
    description: "Bright surfaces for daytime and well-lit environments.",
  },
  {
    value: THEMES.DARK,
    label: "Dark",
    description: "Low-light surfaces for comfortable evening use.",
  },
]);

export function isTheme(value) {
  return THEME_VALUES.includes(value);
}
