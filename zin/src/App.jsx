import { Route, Routes } from "react-router-dom";
import AdminLogin from "./zin-admin/_auth/forms/AdminLogin";
import AdminSignUp from "./zin-admin/_auth/forms/AdminSignUp";
import AdminAuthLayout from "./zin-admin/_auth/AdminAuthLayout";
import AdminRootLayout from "./zin-admin/_root/AdminRootLayout";
import AdminDashboard from "./zin-admin/_root/pages/AdminDashboard";
import Product from "./zin-admin/_root/pages/Product";
import AddProducts from "./zin-admin/_root/pages/AddProducts";
import ProductProfile from "./zin-admin/_root/pages/ProductProfile";
import Users from "./zin-admin/_root/pages/Users";
import ProductList from "./zin-admin/components/ProductList";
import Admins from "./zin-admin/_root/pages/Admins";
import RootLayout from "./zin-frontend/_root/RootLayout";
import Home from "./zin-frontend/_root/pages/Home";
import ProductDetails from "./zin-frontend/components/ProductDetails";
import AllProducts from "./zin-frontend/_root/pages/AllProducts";
import AdminAuthProvider from "./zin-admin/context/AdminAuthProvider";
import UserAuthProvider from "./zin-frontend/context/UserAuthProvider";
import UserAuthLayout from "./zin-frontend/_auth/UserAuthLayout";
import UserLogin from "./zin-frontend/_auth/forms/userLogin";

function App() {
  return (
    <main className="min-h-screen min-w-screen bg-dark-2 text-light-2">
      <Routes>
        {/* Public Routes */}
        <Route
          element={
            <UserAuthProvider>
              <RootLayout />
            </UserAuthProvider>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/allproducts" element={<AllProducts />} />
        </Route>

        <Route
          element={
            <UserAuthProvider>
              <UserAuthLayout />
            </UserAuthProvider>
          }
        >
          <Route path="/login" element={<UserLogin />} />
          <Route path="/signup" element={<AdminSignUp />} />
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
        </Route>
      </Routes>
    </main>
  );
}

export default App;
