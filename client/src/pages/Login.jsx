// React imports
import { useState } from "react";
// React-router imports
import { useNavigate, Link } from "react-router-dom";
// Toast notification library
import { toast } from "react-toastify";

// API instance with baseURL and token interceptors
import API from "../services/api";
// Theme toggle component
import ToggleMode from "../components/ToggleMode";

const Login = () => {
  const navigate = useNavigate(); // Hook to navigate programmatically
  // State to store login form data
  const [form, setForm] = useState({ email: "", password: "" });

  // Handler to update form state on input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handler to perform login on button click
  const handleLogin = async () => {
    try {
      const res = await API.post("/login", form); // POST /api/auth/login
      localStorage.setItem("token", res.data.token); // Store token in localStorage
      toast.success("Login successful"); // Show success toast
      navigate("/home"); // Redirect to home page
    } catch (err) {
      // Show error message from server or default fallback
      toast.error(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="container">
      {/* Theme toggle (light/dark) */}
      <ToggleMode />

      {/* Heading */}
      <h2>Login</h2>

      {/* Email input field */}
      <input name="email" placeholder="Email" onChange={handleChange} />

      {/* Password input field */}
      <input
        name="password"
        placeholder="Password"
        type="password"
        onChange={handleChange}
      />

      {/* Login button */}
      <button onClick={handleLogin}>Login</button>

      {/* Link to signup page */}
      <p style={{ marginTop: "10px" }}>
        Don't have an account? <Link to="/signup">Create one</Link>
      </p>
    </div>
  );
};

export default Login;
