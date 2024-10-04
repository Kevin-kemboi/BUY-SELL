import { Route, Routes } from "react-router-dom";
import ScrollToTop from "./zinfrontend/components/ScrollToTop";
import UserAuthProvider from "./zinfrontend/context/UserAuthProvider";
import CartProvider from "./zinfrontend/context/CartContext";
import RootLayout from "./zinfrontend/_root/RootLayout";
import Home from "./zinfrontend/_root/pages/Home";
import ProductDetails from "./zinfrontend/components/ProductDetails";
import AllProducts from "./zinfrontend/_root/pages/AllProducts";
import FAQ from "./zinfrontend/components/FAQ";
import PrivacyPolicy from "./zinfrontend/components/PrivacyPolicy";
import ShippingReturnPolicy from "./zinfrontend/components/Shipping";
import TermsConditions from "./zinfrontend/components/Terms";
import About from "./zinfrontend/components/About";
import UserAuthLayout from "./zinfrontend/_auth/UserAuthLayout";
import UserLogin from "./zinfrontend/_auth/forms/UserLogin";
import UserSignup from "./zinfrontend/_auth/forms/UserSignup";
import Verification from "./zinfrontend/_auth/forms/Verification";
import AdminAuthProvider from "./zinadmin/context/AdminAuthProvider";
import AdminAuthLayout from "./zinadmin/_auth/AdminAuthLayout";
import AdminLogin from "./zinadmin/_auth/forms/AdminLogin";
import AdminSignUp from "./zinadmin/_auth/forms/AdminSignUp";
import AdminRootLayout from "./zinadmin/_root/AdminRootLayout";
import AdminDashboard from "./zinadmin/_root/pages/AdminDashboard";
import Product from "./zinadmin/_root/pages/Product";
import AddProducts from "./zinadmin/_root/pages/AddProducts";
import ProductList from "./zinadmin/components/ProductList";
import ProductProfile from "./zinadmin/_root/pages/ProductProfile";
import Users from "./zinadmin/_root/pages/Users";
import Admins from "./zinadmin/_root/pages/Admins";
import Configs from "./zinadmin/_root/pages/Configs";
import AddVariant from "./zinadmin/_root/pages/AddVariant";

function App() {
  return (
    <main className="min-h-screen min-w-screen bg-dark-2 text-light-2">
      <ScrollToTop />
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
    </main>
  );
}

export default App;
