import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { AppProviders } from "./AppProviders";
import { reportWebVitals } from "./monitoring/webVitals";

const container = document.getElementById("root");
if (!container) {
  throw new Error("index.html has no element with the id root");
}

// The Mock Service Worker answers API requests in the browser. It is loaded
// only by the development server and only when VITE_ENABLE_MOCK_API is true.
if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_MOCK_API === "true") {
  const { worker } = await import("./mocks/browser");
  await worker.start({ onUnhandledFrame: "bypass" });
}

createRoot(container).render(
  <AppProviders>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AppProviders>,
);

reportWebVitals();
