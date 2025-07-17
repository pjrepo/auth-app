import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import API from "../services/api";
import ToggleMode from "../components/ToggleMode";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const fetchUser = async () => {
    try {
      const res = await API.get("/user");
      setUser(res.data);
    } catch (err) {
      toast.error("Session expired. Please log in again.");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const updatePassword = async () => {
    try {
      await API.put("/update-password", { currentPassword, newPassword });
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update password");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="container">
      <ToggleMode />
      <h2>Welcome, {user.firstName}!</h2>
      <p>Email: {user.email}</p>
      <p>Mobile: {user.mobile}</p>

      <hr />
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
      <button
        onClick={logout}
        className="logout-btn"
        // style={{ backgroundColor: "red", color: "white" }}
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
