import { Route, Routes } from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./zinfrontend/components/ScrollToTop";
import UserAuthProvider from "./zinfrontend/context/UserAuthProvider";
import CartProvider from "./zinfrontend/context/CartContext";
import RootLayout from "./zinfrontend/_root/RootLayout";
import Home from "./zinfrontend/_root/pages/Home";
import ProductDetails from "./zinfrontend/components/ProductDetails";
import AllProducts from "./zinfrontend/_root/pages/AllProducts";
// Lazy load static / rarely changed content pages to reduce initial bundle
const FAQ = lazy(() => import("./zinfrontend/components/FAQ"));
const PrivacyPolicy = lazy(() => import("./zinfrontend/components/PrivacyPolicy"));
const ShippingReturnPolicy = lazy(() => import("./zinfrontend/components/Shipping"));
const TermsConditions = lazy(() => import("./zinfrontend/components/Terms"));
const About = lazy(() => import("./zinfrontend/components/About"));
// Auth Pages
const UserAuthLayout = lazy(() => import("./zinfrontend/_auth/UserAuthLayout"));
const UserLogin = lazy(() => import("./zinfrontend/_auth/forms/UserLogin"));
const UserSignup = lazy(() => import("./zinfrontend/_auth/forms/UserSignup"));
const Verification = lazy(() => import("./zinfrontend/_auth/forms/Verification"));
// Admin
import AdminAuthProvider from "./zinadmin/context/AdminAuthProvider";
const AdminAuthLayout = lazy(() => import("./zinadmin/_auth/AdminAuthLayout"));
const AdminLogin = lazy(() => import("./zinadmin/_auth/forms/AdminLogin"));
const AdminSignUp = lazy(() => import("./zinadmin/_auth/forms/AdminSignUp"));
const AdminRootLayout = lazy(() => import("./zinadmin/_root/AdminRootLayout"));
const AdminDashboard = lazy(() => import("./zinadmin/_root/pages/AdminDashboard"));
const Product = lazy(() => import("./zinadmin/_root/pages/Product"));
const AddProducts = lazy(() => import("./zinadmin/_root/pages/AddProducts"));
const ProductList = lazy(() => import("./zinadmin/components/ProductList"));
const ProductProfile = lazy(() => import("./zinadmin/_root/pages/ProductProfile"));
const Users = lazy(() => import("./zinadmin/_root/pages/Users"));
const Admins = lazy(() => import("./zinadmin/_root/pages/Admins"));
const Configs = lazy(() => import("./zinadmin/_root/pages/Configs"));
const AddVariant = lazy(() => import("./zinadmin/_root/pages/AddVariant"));

function App() {
  // Removed offline badge; still supports lazy loading. To re-enable badge, restore previous logic.
  return (
    <ErrorBoundary>
      <main className="min-h-screen min-w-screen bg-dark-2 text-light-2">
        <ScrollToTop />
        <Suspense fallback={
          <div className="p-10 flex items-center justify-center min-h-[50vh]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-light-2">Loading application...</p>
            </div>
          </div>
        }>
        <Routes>
        {/* Public Routes */}
        <Route
          element={
            <UserAuthProvider>
              <CartProvider>
                <RootLayout />
              </CartProvider>
            </UserAuthProvider>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/allproducts" element={<AllProducts />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/shipping" element={<ShippingReturnPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/about" element={<About />} />
        </Route>

        <Route
          element={
            <UserAuthProvider>
              <CartProvider>
                <UserAuthLayout />
              </CartProvider>
            </UserAuthProvider>
          }
        >
          <Route path="/login" element={<UserLogin />} />
          <Route path="/signup" element={<UserSignup />} />
          <Route path="/verify" element={<Verification />} />
        </Route>

        {/* Admin Routes wrapped with AdminAuthProvider */}
        <Route
          element={
            <AdminAuthProvider>
              <AdminAuthLayout />
            </AdminAuthProvider>
          }
        >
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignUp />} />
        </Route>

        <Route
          element={
            <AdminAuthProvider>
              <AdminRootLayout />
            </AdminAuthProvider>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<Product />} />
          <Route path="/admin/addproducts" element={<AddProducts />} />
          <Route path="/admin/updateproducts" element={<ProductList />} />
          <Route path="/admin/deleteproducts" element={<ProductList />} />
          <Route path="/admin/productslist" element={<ProductProfile />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/admin-users" element={<Admins />} />
          <Route path="/admin/configs" element={<Configs />} />
          <Route path="/admin/addvariant" element={<AddVariant />} />
          <Route path="/admin/updatevariant" element={<AddVariant />} />
        </Route>
        </Routes>
        </Suspense>
      </main>
    </ErrorBoundary>
  );
}

export default App;
