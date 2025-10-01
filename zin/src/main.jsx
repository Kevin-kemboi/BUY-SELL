import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

// Import network debugging utils in development mode
if (import.meta.env.DEV || import.meta.env.VITE_DEBUG === '1') {
  import("@/lib/utils/networkDebug.js").catch(err => 
    console.warn("Failed to load debug utilities:", err)
  );
}


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
        <App />
        <Toaster />
    </BrowserRouter>
  </React.StrictMode>
);
