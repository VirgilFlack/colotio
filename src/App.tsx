
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Index from "./pages/Index";
import DataInput from "./pages/DataInput";
import Calendar from "./pages/Calendar";
import NotFound from "./pages/NotFound";
import Welcome from "./pages/Welcome";
import Account from "./pages/Account";
import Help from "./pages/Help";
import MonthlyReport from "./pages/MonthlyReport";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Function to set a random color theme
    const setRandomColorTheme = () => {
      const themes = [
        'red',
        'orange',
        'yellow',
        'green',
        'blue', // Default
        'indigo',
        'violet',
        'pink',
        'teal'
      ];
      
      // Get a random theme (excluding the current one if possible)
      const currentTheme = localStorage.getItem('colorTheme') || 'blue';
      let availableThemes = themes.filter(t => t !== currentTheme);
      
      // If we somehow filtered out all themes, use the original list
      if (availableThemes.length === 0) {
        availableThemes = themes;
      }
      
      const randomIndex = Math.floor(Math.random() * availableThemes.length);
      const selectedTheme = availableThemes[randomIndex];
      
      // Save the selected theme to localStorage
      localStorage.setItem('colorTheme', selectedTheme);
      
      // Apply the theme
      const root = document.documentElement;
      
      // Reset to default blue theme
      root.style.setProperty('--primary', 'hsl(255 70% 55%)');
      root.style.setProperty('--accent', 'hsl(243 75% 59%)');
      root.style.setProperty('--ring', 'hsl(262 83% 58%)');
      
      // Apply the new theme
      if (selectedTheme !== 'blue') {
        root.style.setProperty('--primary', `var(--${selectedTheme}-primary)`);
        root.style.setProperty('--accent', `var(--${selectedTheme}-accent)`);
        root.style.setProperty('--ring', `var(--${selectedTheme}-ring)`);
      }
      
      console.log(`Applied random color theme: ${selectedTheme}`);
      
      // Force a re-render of components that need to update with the new theme
      window.dispatchEvent(new Event('storage'));
    };
    
    // Set the random color theme on page load
    setRandomColorTheme();
  }, []);

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
              <Route path="/account" element={<Account />} />
              <Route path="/help" element={<Help />} />
              <Route path="/monthly-report" element={<MonthlyReport />} />
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
