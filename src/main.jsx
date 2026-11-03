import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import { initializeTheme } from "./store/themeStore";
import "./index.css";

async function enableMocking() {
  if (
    !import.meta.env.DEV ||
    import.meta.env.VITE_ENABLE_MOCK_API !== "true"
  ) {
    return;
  }

  const { worker } = await import("./mocks/browser");

  await worker.start({
    onUnhandledFrame({ frame, defaults }) {
      const request = frame.data?.request;

      if (request && new URL(request.url).pathname.startsWith("/api/")) {
        return defaults.warn();
      }

      return undefined;
    },
    serviceWorker: {
      url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
    },
  });
}

async function bootstrap() {
  try {
    await enableMocking();
  } catch (error) {
    console.warn(
      "Mock API could not be started. API requests will not be intercepted.",
      error,
    );
  }

  initializeTheme();

  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

bootstrap();
