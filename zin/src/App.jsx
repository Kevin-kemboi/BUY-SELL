import AdminLogin from "./zin-admin/_auth/forms/AdminLogin"
import AdminSignUp from "./zin-admin/_auth/forms/AdminSignUp"
import AdminAuthLayout from "./zin-admin/_auth/AdminAuthLayout"
import AdminRootLayout from "./zin-admin/_root/AdminRootLayout"
import AdminDashboard from "./zin-admin/_root/pages/AdminDashboard"
import { Route, Routes } from "react-router-dom"
import Product from "./zin-admin/_root/pages/Product"


function App() {

  return (
    <main className="min-h-screen min-w-screen bg-dark-2 text-light-2">
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
          <Route path="/admin/products" element={< Product />} />
        </Route>

      </Routes>
    </main>
  )
}

export default App
