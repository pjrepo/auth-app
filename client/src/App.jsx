// Import modules from React Router
import { Routes, Route, Navigate } from "react-router-dom";

// Import page components
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";

// Import ProtectedRoute to guard private routes
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Redirect base path to login */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Public routes */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* Protected route for /home (accessible only if logged in) */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
