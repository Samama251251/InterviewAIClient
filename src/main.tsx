import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { router } from "./router.jsx";
import { RouterProvider } from "react-router-dom";
import { AuthContextProvider } from "./contexts/AuthContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </>
  </StrictMode>
);