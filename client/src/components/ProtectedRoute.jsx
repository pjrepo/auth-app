// Importing Navigate from react-router-dom to redirect users
import { Navigate } from "react-router-dom";

// ProtectedRoute is a HOC(Higher-Order Component) that checks if a user is authenticated
const ProtectedRoute = ({ children }) => {
  // Retrieve the JWT token from localStorage
  const token = localStorage.getItem("token");

  // If the token exists, allow access to the child components (protected route)
  // Otherwise, redirect the user to the login page
  return token ? children : <Navigate to="/login" />;
};

// Exporting the ProtectedRoute component for use in routing
export default ProtectedRoute;
