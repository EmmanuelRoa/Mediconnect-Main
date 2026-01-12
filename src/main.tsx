import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "@/i18n/config";
import { Toaster } from "@/shared/ui/sonner";
import "mapbox-gl/dist/mapbox-gl.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <Toaster />
  </StrictMode>
);
