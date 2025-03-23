
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Recipes from "./pages/Recipes";
import Cart from "./pages/Cart";
import RecipeDetail from "./pages/RecipeDetail";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import GroceryRecognition from "./pages/GroceryRecognition";
import SwipeNavigation from "./components/SwipeNavigation";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import SocialFeed from "./pages/SocialFeed";
import MyGroceries from "./pages/MyGroceries";
import Friends from "./pages/Friends";
import Achievements from "./pages/Achievements";
import PersonalInfo from "./pages/profile/PersonalInfo";
import CookingHistory from "./pages/profile/CookingHistory";
import Goals from "./pages/profile/Goals";
import SavedRecipes from "./pages/profile/SavedRecipes";
import Notifications from "./pages/profile/Notifications";
import Subscription from "./pages/profile/Subscription";
import Feedback from "./pages/profile/Feedback";
import HelpCenter from "./pages/profile/HelpCenter";
import Settings from "./pages/profile/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SwipeNavigation />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/my-groceries" element={<MyGroceries />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/grocery-recognition" element={<GroceryRecognition />} />
            <Route path="/social" element={<SocialFeed />} />
            
            {/* Profile subsections */}
            <Route path="/profile/personal" element={<PersonalInfo />} />
            <Route path="/profile/goals" element={<Goals />} />
            <Route path="/profile/notifications" element={<Notifications />} />
            <Route path="/profile/subscription" element={<Subscription />} />
            <Route path="/profile/saved" element={<SavedRecipes />} />
            <Route path="/profile/history" element={<CookingHistory />} />
            <Route path="/profile/achievements" element={<Achievements />} />
            <Route path="/profile/feedback" element={<Feedback />} />
            <Route path="/profile/help" element={<HelpCenter />} />
            <Route path="/profile/settings" element={<Settings />} />
            
            {/* Redirect old discover path to recipes */}
            <Route path="/discover" element={<Navigate to="/recipes" replace />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Navbar />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
