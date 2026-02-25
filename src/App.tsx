import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth-store";
import { useAppStore } from "@/stores/app-store";
import AppLayout from "@/components/layout/AppLayout";
import AuthPage from "@/pages/AuthPage";
import DashboardPage from "@/pages/DashboardPage";
import AlgorithmsPage from "@/pages/AlgorithmsPage";
import ProjectsPage from "@/pages/ProjectsPage";
import NewProjectPage from "@/pages/NewProjectPage";
import ProjectDetailPage from "@/pages/ProjectDetailPage";
import FeedbackPage from "@/pages/FeedbackPage";
import AiAssistantPage from "@/pages/AiAssistantPage";
import LearningPage from "@/pages/LearningPage";
import CourseBasicsPage from "@/pages/CourseBasicsPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitializing } = useAuthStore();
  if (isInitializing) {
    return <div className="p-6 text-sm text-muted-foreground">Loading...</div>;
  }
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return <AppLayout>{children}</AppLayout>;
}

const App = () => {
  const { initializeAuth, isAuthenticated } = useAuthStore();
  const { bootstrap, isLoaded } = useAppStore();

  useEffect(() => {
    void initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (isAuthenticated && !isLoaded) {
      void bootstrap();
    }
  }, [bootstrap, isAuthenticated, isLoaded]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/algorithms" element={<ProtectedRoute><AlgorithmsPage /></ProtectedRoute>} />
            <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
            <Route path="/projects/new" element={<ProtectedRoute><NewProjectPage /></ProtectedRoute>} />
            <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetailPage /></ProtectedRoute>} />
            <Route path="/feedback" element={<ProtectedRoute><FeedbackPage /></ProtectedRoute>} />
            <Route path="/ai-assistant" element={<ProtectedRoute><AiAssistantPage /></ProtectedRoute>} />
            <Route path="/learning" element={<ProtectedRoute><LearningPage /></ProtectedRoute>} />
            <Route path="/learning/course/:id" element={<ProtectedRoute><CourseBasicsPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
