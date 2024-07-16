import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import AdminAuthProvider from "./zin-admin/context/AdminAuthProvider.jsx";
import { Toaster } from "@/components/ui/toaster"


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AdminAuthProvider>
        <App />
        <Toaster />
      </AdminAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
