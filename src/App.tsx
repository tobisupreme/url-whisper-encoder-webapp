
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import EncoderDecoder from "./pages/tools/EncoderDecoder";
import KaraokeFinder from "./pages/tools/KaraokeFinder";
import BloodPressureMonitor from "./pages/tools/BloodPressureMonitor";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    document.body.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tools/encoder-decoder" element={<EncoderDecoder />} />
            <Route path="/tools/karaoke-finder" element={<KaraokeFinder />} />
            <Route path="/tools/blood-pressure-monitor" element={<BloodPressureMonitor />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
