import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import RtlProvider from "./components/RtlProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RtlProvider>
      <App />
    </RtlProvider>
  </StrictMode>
);
