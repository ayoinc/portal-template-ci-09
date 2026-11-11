import { CssBaseline, ThemeProvider } from "@mui/material";
import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, StrictMode, useState } from "react";
import { Provider as StoreProvider } from "react-redux";
import { createQueryClient } from "./api/queryClient";
import { createStore } from "./store/store";
import { theme } from "./theme";

interface AppProvidersProps {
  children: ReactNode;
  /** Replaces the default query client, for example in tests. */
  queryClient?: QueryClient;
}

const defaultQueryClient = createQueryClient();

/** Wraps the application in React strict mode and the providers its features need. */
export function AppProviders({ children, queryClient = defaultQueryClient }: AppProvidersProps) {
  // One store per mounted tree keeps tests and stories independent of each other.
  const [store] = useState(createStore);
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <StoreProvider store={store}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </StoreProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
