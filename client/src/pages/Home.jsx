// React imports
import { useEffect, useState } from "react";
// React-router imports
import { useNavigate } from "react-router-dom";
// Toast notification library
import { toast } from "react-toastify";

// API instance with baseURL and token interceptors
import API from "../services/api";
// Theme toggle component
import ToggleMode from "../components/ToggleMode";

const Home = () => {
  const navigate = useNavigate(); // Navigation hook from react-router-dom

  // State to hold user info and password fields
  const [user, setUser] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Fetch user info from backend
  const fetchUser = async () => {
    try {
      const res = await API.get("/user"); // GET /api/auth/user
      setUser(res.data); // Store user data in state
    } catch (err) {
      // Handle token expiry or unauthorized access
      toast.error("Session expired. Please log in again.");
      localStorage.removeItem("token"); // Clear invalid token
      navigate("/login"); // Redirect to login
    }
  };

  // Update user's password
  const updatePassword = async () => {
    try {
      await API.put("/update-password", { currentPassword, newPassword }); // PUT /api/auth/update-password
      toast.success("Password updated successfully");
      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      // Show error from server or default message
      toast.error(err.response?.data?.error || "Failed to update password");
    }
  };

  // Handle user logout
  const logout = () => {
    localStorage.removeItem("token"); // Clear token
    navigate("/login"); // Redirect to login page
  };

  // Run fetchUser on component mount
  useEffect(() => {
    fetchUser();
  }, []);

  // Show loading message while user info is being fetched
  if (!user) return <p>Loading...</p>;

  return (
    <div className="container">
      {/* Dark/Light mode toggle */}
      <ToggleMode />
      {/* Welcome message and user details */}
      <h2>Welcome, {user.firstName}!</h2>
      <p>Email: {user.email}</p>
      <p>Mobile: {user.mobile}</p>

      <hr />

      {/* Password update section */}
      <h3>Update Password</h3>
      <input
        placeholder="Current Password"
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />
      <input
        placeholder="New Password"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={updatePassword}>Update</button>

      <hr />

      {/* Logout button */}
      <button onClick={logout} className="logout-btn">
        Logout
      </button>
    </div>
  );
};

export default Home;
