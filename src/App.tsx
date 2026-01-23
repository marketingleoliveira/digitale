import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import Prints from "./pages/Prints";
import Sustainability from "./pages/Sustainability";
import Privacy from "./pages/Privacy";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";
import { WhatsAppButton } from "./components/chat/WhatsAppButton";
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
import Newsletter from "./pages/admin/Newsletter";
import AdminTestimonials from "./pages/admin/Testimonials";
import { NewsletterPopup } from "./components/newsletter/NewsletterPopup";

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
              <Route path="/inicio" element={<Navigate to="/" replace />} />
              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/sobre" element={<About />} />
              <Route path="/nosotros" element={<Navigate to="/sobre" replace />} />
              <Route path="/about" element={<Navigate to="/sobre" replace />} />
              <Route path="/contato" element={<Contact />} />
              <Route path="/contacto" element={<Navigate to="/contato" replace />} />
              <Route path="/contact" element={<Navigate to="/contato" replace />} />
              <Route path="/tecidos" element={<Fabrics />} />
              <Route path="/tecidos/:slug" element={<FabricDetail />} />
              <Route path="/tejidos" element={<Navigate to="/tecidos" replace />} />
              <Route path="/fabrics" element={<Navigate to="/tecidos" replace />} />
              <Route path="/estampas" element={<Prints />} />
              <Route path="/estampados" element={<Navigate to="/estampas" replace />} />
              <Route path="/prints" element={<Navigate to="/estampas" replace />} />
              <Route path="/sustentabilidade" element={<Sustainability />} />
              <Route path="/sostenibilidad" element={<Navigate to="/sustentabilidade" replace />} />
              <Route path="/sustainability" element={<Navigate to="/sustentabilidade" replace />} />
              <Route path="/politica-de-privacidade" element={<Privacy />} />
              <Route path="/privacidade" element={<Navigate to="/politica-de-privacidade" replace />} />
              <Route path="/privacy" element={<Navigate to="/politica-de-privacidade" replace />} />
              <Route path="/termos" element={<Navigate to="/politica-de-privacidade" replace />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin/carousel" element={<ProtectedRoute requireAdmin><Carousel /></ProtectedRoute>} />
              <Route path="/admin/fabrics" element={<ProtectedRoute><AdminFabrics /></ProtectedRoute>} />
              <Route path="/admin/testimonials" element={<ProtectedRoute><AdminTestimonials /></ProtectedRoute>} />
              <Route path="/admin/posts" element={<ProtectedRoute><Posts /></ProtectedRoute>} />
              <Route path="/admin/posts/:id" element={<ProtectedRoute><PostEditor /></ProtectedRoute>} />
              <Route path="/admin/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
              <Route path="/admin/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
              <Route path="/admin/newsletter" element={<ProtectedRoute requireAdmin><Newsletter /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute requireAdmin><Settings /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute requireAdmin><Users /></ProtectedRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            <WhatsAppButton />
            <NewsletterPopup />
          </BrowserRouter>
        </TooltipProvider>
      </FavoritesProvider>
    </AuthProvider>
  </LanguageProvider>
</QueryClientProvider>
);

export default App;
