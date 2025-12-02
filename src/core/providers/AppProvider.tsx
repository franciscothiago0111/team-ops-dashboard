"use client";

import { ReactNode, useState, useEffect } from "react";
import { AuthProvider } from "./AuthProvider";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "../components/ErrorBoundary";

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            throwOnError: false,
          },
          mutations: {
            // Prevent React Query from throwing errors that would trigger Next.js error overlay
            throwOnError: false,
          },
        }
      })
  );

  // Suppress unhandled promise rejections in development
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Only suppress AppError instances
      if (event.reason?.name === "AppError") {
        event.preventDefault();
        console.log("AppError caught and handled:", event.reason.message);
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Toaster position="top-right" richColors />
          {children}
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
