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

const Signup = () => {
  const navigate = useNavigate(); // For programmatic navigation

  // State for form inputs
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
  });

  // State to track OTP flow
  const [otpSent, setOtpSent] = useState(false);
  // State to track user-entered OTP
  const [otp, setOtp] = useState("");

  // Handler for input fields
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Function to send OTP to user's email
  const sendOtp = async () => {
    try {
      await API.post("/send-otp", { email: form.email }); // POST /api/auth/send-otp
      console.log("OTP send button pressed!");
      setOtpSent(true); // Show OTP input field
      toast.success("OTP sent to your email");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.error || "Failed to send OTP");
    }
  };

  // Function to complete signup with OTP and form data
  const signup = async () => {
    try {
      await API.post("/signup", { ...form, otp }); // POST /api/auth/signup
      toast.success("Signup successful");
      navigate("/login"); // Redirect to login on success
    } catch (err) {
      toast.error(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="container">
      {/* Theme toggle */}
      <ToggleMode />

      {/* Heading */}
      <h2>Signup</h2>

      {/* Input fields for user details */}
      <input
        name="firstName"
        placeholder="First Name"
        onChange={handleChange}
      />
      <input name="lastName" placeholder="Last Name" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="mobile" placeholder="Mobile" onChange={handleChange} />
      <input
        name="password"
        placeholder="Password"
        type="password"
        onChange={handleChange}
      />

      {/* Conditional rendering: show Send OTP or OTP input and Complete Signup */}
      {!otpSent ? (
        // If OTP not sent yet, show Send OTP button
        <button onClick={sendOtp}>Send OTP</button>
      ) : (
        <>
          {/* OTP input and complete signup button */}
          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={signup}>Complete Signup</button>

          {/* Resend OTP link */}
          <p style={{ textAlign: "center", marginTop: "10px" }}>
            Didn’t receive OTP?{" "}
            <span
              onClick={sendOtp}
              style={{
                color: "#4f46e5",
                cursor: "pointer",
              }}
            >
              Resend OTP
            </span>
          </p>
        </>
      )}

      {/* Link to login page if user already has an account */}
      <p style={{ marginTop: "10px" }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
