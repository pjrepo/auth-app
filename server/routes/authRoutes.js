// Import express and required modules
import express from "express";

// Import controller functions
import {
  sendOtp,
  verifyOtp,
  signup,
  login,
  getUser,
  updatePassword,
} from "../controllers/authController.js";

// Middleware to verify JWT token
import verifyToken from "../middlewares/verifyToken.js";

// Middleware to limit rate of requests
import rateLimiter from "../middlewares/rateLimiter.js";

// Destructured Router from express and initialize
const { Router } = express;

const router = Router();

/* ===========================
   Public Routes with Rate Limiting
=========================== */

// Send OTP to user's email (rate-limited to prevent abuse)
router.post("/send-otp", rateLimiter, sendOtp);

// Verify OTP received via email
router.post("/verify-otp", rateLimiter, verifyOtp);

// Complete signup after OTP verification
router.post("/signup", rateLimiter, signup);

// Login with email and password
router.post("/login", rateLimiter, login);

/* ===========================
   Protected Routes
=========================== */

// Fetch current user details (requires valid JWT token)
router.get("/user", verifyToken, getUser);

// Update password (requires valid JWT + rate limiting)
router.put("/update-password", verifyToken, rateLimiter, updatePassword);

export default router;
