import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import Host from "./Host";
import "./index.css";

const isHost = window.location.pathname.startsWith("/host");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {isHost ? <Host /> : <App />}
  </StrictMode>,
);
