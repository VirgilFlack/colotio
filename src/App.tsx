
import React from "react"; // Adding explicit React import
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Index from "./pages/Index";
import DataInput from "./pages/DataInput";
import Calendar from "./pages/Calendar";
import NotFound from "./pages/NotFound";
import Welcome from "./pages/Welcome"; // Import the new Welcome component

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <React.StrictMode>
          <TooltipProvider>
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/dashboard" element={<Index />} />
              <Route path="/data-input" element={<DataInput />} />
              <Route path="/calendar" element={<Calendar />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </React.StrictMode>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
