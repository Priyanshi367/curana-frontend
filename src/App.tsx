import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SidebarProvider } from "./contexts/SidebarContext";
import { LayoutProvider } from "./contexts/LayoutContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Network from "./pages/Network";
import Departments from "./pages/Departments";
import Policies from "./pages/Policies";
import Directory from "./pages/Directory";
import Help from "./pages/Help";
import Workspace from "./pages/Workspace";
import OrganizationChart from "./pages/OrganizationChart";
import Resources from "./pages/Resources";
import Reports from "./pages/Reports";
import Forms from "./pages/Forms";
import CalendarPage from "./pages/Calendar";
import News from "./pages/News";
import Providers from "./pages/Providers";
import NotFound from "./pages/NotFound";
import MenuDebug from "./pages/MenuDebug";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <SidebarProvider>
        <LayoutProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/home" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
                <Route path="/about/network" element={<ProtectedRoute><Network /></ProtectedRoute>} />
                <Route path="/departments" element={<ProtectedRoute><Departments /></ProtectedRoute>} />
                <Route path="/departments/learning" element={<ProtectedRoute><Departments /></ProtectedRoute>} />
                <Route path="/it" element={<ProtectedRoute><Departments /></ProtectedRoute>} />
                <Route path="/learning" element={<ProtectedRoute><Departments /></ProtectedRoute>} />
                <Route path="/it" element={<ProtectedRoute><Departments /></ProtectedRoute>} />
                <Route path="/policies" element={<ProtectedRoute><Policies /></ProtectedRoute>} />
                <Route path="/directory" element={<ProtectedRoute><Directory /></ProtectedRoute>} />
                <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />
                <Route path="/workspace" element={<ProtectedRoute><Workspace /></ProtectedRoute>} />
                <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                <Route path="/forms" element={<ProtectedRoute><Forms /></ProtectedRoute>} />
                <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
                <Route path="/news" element={<ProtectedRoute><News /></ProtectedRoute>} />
                <Route path="/providers" element={<ProtectedRoute><Providers /></ProtectedRoute>} />
                <Route path="/organization-chart" element={<ProtectedRoute><OrganizationChart /></ProtectedRoute>} />
                <Route path="/menu-debug" element={<ProtectedRoute><MenuDebug /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </LayoutProvider>
      </SidebarProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
