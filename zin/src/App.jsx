import AdminLogin from "./zin-admin/_auth/forms/AdminLogin"
import AdminSignUp from "./zin-admin/_auth/forms/AdminSignUp"
import AdminAuthLayout from "./zin-admin/_auth/AdminAuthLayout"
import AdminRootLayout from "./zin-admin/_root/AdminRootLayout"
import AdminDashboard from "./zin-admin/_root/pages/AdminDashboard"
import { Route, Routes } from "react-router-dom"
import Product from "./zin-admin/_root/pages/Product"
import AddProducts from "./zin-admin/_root/pages/AddProducts"
import ProductList from "./zin-admin/_root/pages/ProductList"
import Users from "./zin-admin/_root/pages/Users"


function App() {

  return (
    <main className=" min-h-screen min-w-screen bg-dark-2 text-light-2">
      {/* Admin Public routes */}
      <Routes>
        <Route element={<AdminAuthLayout/>}>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignUp />} />
        </Route>
      </Routes>

      {/* Admin private routes */}
      <Routes>
        <Route element={<AdminRootLayout />} >
          <Route path="/admin" element={< AdminDashboard />} />
          {/* product routes */}
          <Route path="/admin/products" element={< Product />} />
          <Route path="/admin/addproducts" element={< AddProducts />} />
          <Route path="/admin/updateproducts" element={< AddProducts />} />
          <Route path="/admin/deleteproducts" element={< AddProducts />} />
          <Route path="/admin/productslist" element={< ProductList />} />

          {/* User routes */}
          <Route path="/admin/users" element={< Users />} />

        </Route>

      </Routes>
    </main>
  )
}

export default App
