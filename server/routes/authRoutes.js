import express from "express";
import {
  sendOtp,
  verifyOtp,
  signup,
  login,
  getUser,
  updatePassword,
} from "../controllers/authController.js";
import verifyToken from "../middlewares/verifyToken.js";
import rateLimiter from "../middlewares/rateLimiter.js";

const { Router } = express;

const router = Router();

router.post("/send-otp", rateLimiter, sendOtp);
router.post("/verify-otp", rateLimiter, verifyOtp);
router.post("/signup", rateLimiter, signup);
router.post("/login", rateLimiter, login);
router.get("/user", verifyToken, getUser);
router.put("/update-password", verifyToken, rateLimiter, updatePassword);

export default router;
