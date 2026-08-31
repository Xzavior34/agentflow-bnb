import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Route-level code splitting
const Index = lazy(() => import("./pages/Index"));
const AgentsMarketplace = lazy(() => import("./pages/agents/AgentsMarketplace"));
const AgentProfile = lazy(() => import("./pages/agents/AgentProfile"));
const CategoryPage = lazy(() => import("./pages/categories/CategoryPage"));
const Compare = lazy(() => import("./pages/Compare"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const RouteFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground font-mono text-xs">
    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse mr-2" />
    Loading AgentFlow…
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner 
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            color: 'hsl(var(--foreground))',
          },
        }}
      />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-background text-foreground">
          <Header />
          <main className="flex-1 pt-16">
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                {/* Core Marketplace Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/agents" element={<AgentsMarketplace />} />
                <Route path="/agents/:chainId/:tokenId" element={<AgentProfile />} />
                <Route path="/categories/:category" element={<CategoryPage />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/how-it-works" element={<HowItWorks />} />

                {/* Clean Legacy Redirects */}
                <Route path="/marketplace" element={<Navigate to="/agents" replace />} />
                <Route path="/demo" element={<Navigate to="/agents" replace />} />
                <Route path="/register" element={<Navigate to="/how-it-works" replace />} />

                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
