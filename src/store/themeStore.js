import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  DEFAULT_THEME,
  isTheme,
  THEME_STORAGE_KEY,
  THEMES,
} from "../constants/theme";

function applyTheme(theme) {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", theme);
  }
}

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: DEFAULT_THEME,

      setTheme: (theme) => {
        if (!isTheme(theme)) {
          return;
        }

        set({ theme });
        applyTheme(theme);
      },

      toggleTheme: () => {
        const nextTheme =
          get().theme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;

        set({ theme: nextTheme });
        applyTheme(nextTheme);
      },
    }),
    {
      name: THEME_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...persistedState,
        theme: isTheme(persistedState?.theme)
          ? persistedState.theme
          : DEFAULT_THEME,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.theme);
        }
      },
    },
  ),
);

export function initializeTheme() {
  applyTheme(useThemeStore.getState().theme);
}
