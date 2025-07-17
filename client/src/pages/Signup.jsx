import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import API from "../services/api";
import ToggleMode from "../components/ToggleMode";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    try {
      await API.post("/send-otp", { email: form.email });
      console.log("OTP send button pressed!");
      setOtpSent(true);
      toast.success("OTP sent to your email");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.error || "Failed to send OTP");
    }
  };

  const signup = async () => {
    try {
      await API.post("/signup", { ...form, otp });
      toast.success("Signup successful");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="container">
      <ToggleMode />
      <h2>Signup</h2>
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

      {!otpSent ? (
        <button onClick={sendOtp}>Send OTP</button>
      ) : (
        <>
          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={signup}>Complete Signup</button>
          <p style={{ textAlign: "center", marginTop: "10px" }}>
            Didn’t receive OTP?{" "}
            <span
              onClick={sendOtp}
              style={{
                color: "#4f46e5",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Resend OTP
            </span>
          </p>
        </>
      )}
      <p style={{ marginTop: "10px" }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
