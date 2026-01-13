import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { KoasProvider } from "./context/KoasContext";
import Index from "./pages/Index";
import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";
import ProfileSetup from "./pages/ProfileSetup";
import DepartmentList from "./pages/DepartmentList";
import DepartmentDetail from "./pages/DepartmentDetail";
import RequirementDetail from "./pages/RequirementDetail";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Install from "./pages/Install";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <KoasProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/splash" element={<Splash />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/profile-setup" element={<ProfileSetup />} />
            <Route path="/departments" element={<DepartmentList />} />
            <Route path="/department/:departmentId" element={<DepartmentDetail />} />
            <Route path="/department/:departmentId/requirement/:requirementId" element={<RequirementDetail />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/install" element={<Install />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </KoasProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
