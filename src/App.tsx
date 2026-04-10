import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";

import RoleSelect from "./pages/RoleSelect";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

import SellerLayout from "./layouts/SellerLayout";
import SellerDashboard from "./pages/seller/SellerDashboard";
import CategorySelect from "./pages/seller/CategorySelect";
import AddProduct from "./pages/seller/AddProduct";
import EditProduct from "./pages/seller/EditProduct";
import MyProducts from "./pages/seller/MyProducts";
import SellerOrders from "./pages/seller/SellerOrders";
import SellerChat from "./pages/seller/SellerChat";
import SellerProfile from "./pages/seller/SellerProfile";
import SellerAnalytics from "./pages/seller/SellerAnalytics";
import SellerRevenue from "./pages/seller/SellerRevenue";
import SellerCustomers from "./pages/seller/SellerCustomers";
import SellerOffers from "./pages/seller/SellerOffers";
import SellerReviews from "./pages/seller/SellerReviews";
import SellerPromotions from "./pages/seller/SellerPromotions";
import SellerLocation from "./pages/seller/SellerLocation";
import SellerNotifications from "./pages/seller/SellerNotifications";
import SellerPayments from "./pages/seller/SellerPayments";
import SellerSecurity from "./pages/seller/SellerSecurity";
import SellerPolicies from "./pages/seller/SellerPolicies";
import SellerSettings from "./pages/seller/SellerSettings";
import SellerHelp from "./pages/seller/SellerHelp";

import CustomerLayout from "./layouts/CustomerLayout";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CustomerSearch from "./pages/customer/CustomerSearch";
import CustomerCategories from "./pages/customer/CustomerCategories";
import CustomerChat from "./pages/customer/CustomerChat";
import CustomerOrders from "./pages/customer/CustomerOrders";
import CustomerCart from "./pages/customer/CustomerCart";
import CustomerProfile from "./pages/customer/CustomerProfile";
import CustomerWishlist from "./pages/customer/CustomerWishlist";
import CustomerDeals from "./pages/customer/CustomerDeals";
import CustomerReviews from "./pages/customer/CustomerReviews";
import CustomerAddresses from "./pages/customer/CustomerAddresses";
import CustomerNotifications from "./pages/customer/CustomerNotifications";
import CustomerPayments from "./pages/customer/CustomerPayments";
import CustomerSecurity from "./pages/customer/CustomerSecurity";
import CustomerSettings from "./pages/customer/CustomerSettings";
import CustomerHelp from "./pages/customer/CustomerHelp";
import ProductDetail from "./pages/customer/ProductDetail";

import AdminDashboard from "./pages/admin/AdminDashboard";

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

            {/* Admin */}
            <Route path="/admin" element={<AdminDashboard />} />

            {/* Seller */}
            <Route path="/seller" element={<SellerLayout />}>
              <Route index element={<SellerDashboard />} />
              <Route path="categories" element={<CategorySelect />} />
              <Route path="products" element={<MyProducts />} />
              <Route path="products/new" element={<AddProduct />} />
              <Route path="products/edit/:id" element={<EditProduct />} />
              <Route path="orders" element={<SellerOrders />} />
              <Route path="chat" element={<SellerChat />} />
              <Route path="profile" element={<SellerProfile />} />
              <Route path="analytics" element={<SellerAnalytics />} />
              <Route path="revenue" element={<SellerRevenue />} />
              <Route path="customers" element={<SellerCustomers />} />
              <Route path="offers" element={<SellerOffers />} />
              <Route path="reviews" element={<SellerReviews />} />
              <Route path="promotions" element={<SellerPromotions />} />
              <Route path="location" element={<SellerLocation />} />
              <Route path="notifications" element={<SellerNotifications />} />
              <Route path="payments" element={<SellerPayments />} />
              <Route path="security" element={<SellerSecurity />} />
              <Route path="policies" element={<SellerPolicies />} />
              <Route path="settings" element={<SellerSettings />} />
              <Route path="help" element={<SellerHelp />} />
            </Route>

            {/* Customer */}
            <Route path="/customer" element={<CustomerLayout />}>
              <Route index element={<CustomerDashboard />} />
              <Route path="search" element={<CustomerSearch />} />
              <Route path="categories" element={<CustomerCategories />} />
              <Route path="product/:id" element={<ProductDetail />} />
              <Route path="cart" element={<CustomerCart />} />
              <Route path="orders" element={<CustomerOrders />} />
              <Route path="chat" element={<CustomerChat />} />
              <Route path="profile" element={<CustomerProfile />} />
              <Route path="wishlist" element={<CustomerWishlist />} />
              <Route path="saved" element={<CustomerWishlist />} />
              <Route path="deals" element={<CustomerDeals />} />
              <Route path="recent" element={<CustomerDashboard />} />
              <Route path="reviews" element={<CustomerReviews />} />
              <Route path="addresses" element={<CustomerAddresses />} />
              <Route path="notifications" element={<CustomerNotifications />} />
              <Route path="payments" element={<CustomerPayments />} />
              <Route path="security" element={<CustomerSecurity />} />
              <Route path="settings" element={<CustomerSettings />} />
              <Route path="help" element={<CustomerHelp />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
