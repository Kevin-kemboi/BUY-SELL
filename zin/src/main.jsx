import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { HashRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster"


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
        <App />
        <Toaster />
    </HashRouter>
  </React.StrictMode>
);
