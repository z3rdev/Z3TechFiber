import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { FusionProvider } from "@/contexts/FusionContext";
import { AppLayout } from "@/components/AppLayout";
import Login from "@/pages/Login";
import MapView from "@/pages/MapView";
import Dashboard from "@/pages/Dashboard";
import Metrics from "@/pages/Metrics";
import Settings from "@/pages/Settings";
import Tools from "@/pages/Tools";
import About from "@/pages/About";
import Fusion from "@/pages/Fusion";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
      <Route index element={<MapView />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="metrics" element={<Metrics />} />
      <Route path="settings" element={<Settings />} />
      <Route path="tools" element={<Tools />} />
      <Route path="about" element={<About />} />
      <Route path="fusion/*" element={<Fusion />} />
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <FusionProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </FusionProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
