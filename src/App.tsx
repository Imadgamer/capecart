import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";

import RoleSelect from "./pages/RoleSelect";
import Auth from "./pages/Auth";
import VerifyOtp from "./pages/VerifyOtp";
import NotFound from "./pages/NotFound";

import SellerLayout from "./layouts/SellerLayout";
import SellerDashboard from "./pages/seller/SellerDashboard";
import CategorySelect from "./pages/seller/CategorySelect";
import AddProduct from "./pages/seller/AddProduct";
import MyProducts from "./pages/seller/MyProducts";
import SellerOrders from "./pages/seller/SellerOrders";
import SellerChat from "./pages/seller/SellerChat";
import SellerProfile from "./pages/seller/SellerProfile";
import PlaceholderPage from "./pages/seller/PlaceholderPage";

import CustomerLayout from "./layouts/CustomerLayout";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CustomerSearch from "./pages/customer/CustomerSearch";
import CustomerCategories from "./pages/customer/CustomerCategories";
import CustomerChat from "./pages/customer/CustomerChat";
import CustomerOrders from "./pages/customer/CustomerOrders";
import CustomerCart from "./pages/customer/CustomerCart";
import CustomerProfile from "./pages/customer/CustomerProfile";
import CustomerPlaceholder from "./pages/customer/CustomerPlaceholder";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<RoleSelect />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />

            {/* Seller */}
            <Route path="/seller" element={<SellerLayout />}>
              <Route index element={<SellerDashboard />} />
              <Route path="categories" element={<CategorySelect />} />
              <Route path="products" element={<MyProducts />} />
              <Route path="products/new" element={<AddProduct />} />
              <Route path="orders" element={<SellerOrders />} />
              <Route path="chat" element={<SellerChat />} />
              <Route path="profile" element={<SellerProfile />} />
              <Route path="analytics" element={<PlaceholderPage />} />
              <Route path="revenue" element={<PlaceholderPage />} />
              <Route path="customers" element={<PlaceholderPage />} />
              <Route path="offers" element={<PlaceholderPage />} />
              <Route path="reviews" element={<PlaceholderPage />} />
              <Route path="promotions" element={<PlaceholderPage />} />
              <Route path="location" element={<PlaceholderPage />} />
              <Route path="notifications" element={<PlaceholderPage />} />
              <Route path="payments" element={<PlaceholderPage />} />
              <Route path="security" element={<PlaceholderPage />} />
              <Route path="policies" element={<PlaceholderPage />} />
              <Route path="settings" element={<PlaceholderPage />} />
              <Route path="help" element={<PlaceholderPage />} />
            </Route>

            {/* Customer */}
            <Route path="/customer" element={<CustomerLayout />}>
              <Route index element={<CustomerDashboard />} />
              <Route path="search" element={<CustomerSearch />} />
              <Route path="categories" element={<CustomerCategories />} />
              <Route path="cart" element={<CustomerCart />} />
              <Route path="orders" element={<CustomerOrders />} />
              <Route path="chat" element={<CustomerChat />} />
              <Route path="profile" element={<CustomerProfile />} />
              <Route path="wishlist" element={<CustomerPlaceholder />} />
              <Route path="saved" element={<CustomerPlaceholder />} />
              <Route path="deals" element={<CustomerPlaceholder />} />
              <Route path="recent" element={<CustomerPlaceholder />} />
              <Route path="reviews" element={<CustomerPlaceholder />} />
              <Route path="addresses" element={<CustomerPlaceholder />} />
              <Route path="notifications" element={<CustomerPlaceholder />} />
              <Route path="payments" element={<CustomerPlaceholder />} />
              <Route path="security" element={<CustomerPlaceholder />} />
              <Route path="settings" element={<CustomerPlaceholder />} />
              <Route path="help" element={<CustomerPlaceholder />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
