import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Fabrics from "./pages/Fabrics";
import FabricDetail from "./pages/FabricDetail";
import NotFound from "./pages/NotFound";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Posts from "./pages/admin/Posts";
import PostEditor from "./pages/admin/PostEditor";
import Categories from "./pages/admin/Categories";
import Contacts from "./pages/admin/Contacts";
import Settings from "./pages/admin/Settings";
import Users from "./pages/admin/Users";
import Carousel from "./pages/admin/Carousel";
import AdminFabrics from "./pages/admin/Fabrics";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <FavoritesProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<Blog />} />
              <Route path="/sobre" element={<About />} />
              <Route path="/contato" element={<Contact />} />
              <Route path="/tecidos" element={<Fabrics />} />
              <Route path="/tecidos/:slug" element={<FabricDetail />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin/carousel" element={<ProtectedRoute requireAdmin><Carousel /></ProtectedRoute>} />
              <Route path="/admin/fabrics" element={<ProtectedRoute><AdminFabrics /></ProtectedRoute>} />
              <Route path="/admin/posts" element={<ProtectedRoute><Posts /></ProtectedRoute>} />
              <Route path="/admin/posts/:id" element={<ProtectedRoute><PostEditor /></ProtectedRoute>} />
              <Route path="/admin/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
              <Route path="/admin/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute requireAdmin><Settings /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute requireAdmin><Users /></ProtectedRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </FavoritesProvider>
    </AuthProvider>
  </LanguageProvider>
</QueryClientProvider>
);

export default App;
