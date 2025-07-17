// Importing Axios library for making HTTP requests
import axios from "axios";

// Creating a custom Axios instance with a predefined base URL
const API = axios.create({
  // Base path for all auth-related API requests
  baseURL: "https://auth-app-server-x7zp.onrender.com/api/auth",
});

// Setting up a request interceptor to automatically attach the JWT token
API.interceptors.request.use((req) => {
  // Get the token from localStorage
  const token = localStorage.getItem("token");

  // If token exists, set the Authorization header
  if (token) {
    req.headers.Authorization = `Bearer ${token}`; // Attach token in Bearer format
  }

  // Return the modified request config
  return req;
});

// Exporting the configured Axios instance for use in other files
export default API;
