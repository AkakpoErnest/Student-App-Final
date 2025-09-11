
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import ProductDetail from "./pages/ProductDetail";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import HowItWorks from "./pages/HowItWorks";
import NotFound from "./pages/NotFound";
import PostOpportunityPage from "./pages/PostOpportunityPage";
import WhatsAppBot from "./pages/WhatsAppBot";
import BotTest from "./pages/BotTest";
import APITest from "./pages/APITest";
// MoMoTest temporarily disabled

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="stufind-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/post-opportunity" element={<PostOpportunityPage />} />
            <Route path="/whatsapp-bot" element={<WhatsAppBot />} />
            <Route path="/bot-test" element={<BotTest />} />
            <Route path="/api-test" element={<APITest />} />
            {/* MoMoTest temporarily disabled */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
