// Enables additional checks and warnings in development mode
import { StrictMode } from "react";

// React 18+ API for creating root
import { createRoot } from "react-dom/client";

// Global CSS styles
import "./index.css";

// Main application component
import App from "./App.jsx";

// Toast notifications
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Required styles for toast messages

// Router provider for enabling navigation in React
import { BrowserRouter } from "react-router-dom";

// Mount the React application to the DOM
createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Enables routing throughout the app */}
    <BrowserRouter>
      {/* Main App Component containing all routes */}
      <App />

      {/* ToastContainer renders toast messages */}
      <ToastContainer
        position="top-center" // Position of the toast on screen
        autoClose={3000} // Auto dismiss after 3 seconds
      />
    </BrowserRouter>
  </StrictMode>
);
