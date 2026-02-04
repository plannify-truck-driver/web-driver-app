import "@/i18n"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./app/styles/index.css"
import { ThemeProvider } from "./app/providers/ThemeProvider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createRouter, RouterProvider } from "@tanstack/react-router"
import { routeTree } from "@/routeTree.gen"
import type { AuthState } from "./app/providers/AuthProvider"
import { Toaster } from "@/shared/components/ui/Sonner"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
})

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultStaleTime: 5000,
  scrollRestoration: true,
  context: { auth: undefined! },
})

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

const auth: AuthState = {
  isAuthenticated: true,
  isLoading: false,
  driver: null,
  accessToken: null,
  login: () => {},
  logout: () => {},
  signinSilent: async () => {
    return null
  },
  error: null,
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} context={{ auth }} />
        <Toaster
          theme="system"
          position={window.innerWidth < 768 ? "top-center" : "bottom-right"}
          closeButton={true}
        />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
)
