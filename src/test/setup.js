import "@testing-library/jest-dom/vitest";
import { cleanup, configure } from "@testing-library/react";
import toast from "react-hot-toast";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { queryClient } from "@/app/queryClient";
import { resetManagementData } from "@/mocks/data/management";
import { server } from "@/mocks/server";
import { resetAuthState } from "./helpers/auth";

configure({ asyncUtilTimeout: 5000 });

if (!window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

beforeAll(() => {
  server.listen({ onUnhandledFrame: "error" });
});

afterEach(() => {
  cleanup();
  toast.remove();
  server.resetHandlers();
  queryClient.clear();
  resetManagementData();
  resetAuthState();
  localStorage.clear();
  document.documentElement.setAttribute("data-theme", "nexus-light");
});

afterAll(() => {
  server.close();
});
