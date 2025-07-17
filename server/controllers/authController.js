// For password hashing
import bcrypt from "bcrypt";
// For creating JWT tokens
import jwt from "jsonwebtoken";
// For generating secure random userId
import crypto from "crypto";

// Import Mongoose models
import User from "../models/User.js";
import Otp from "../models/Otp.js";

// Utility for sending email
import sendEmail from "../utils/sendEmail.js";

// Generate a unique user ID prefixed with "UID-"
const generateUserId = () => "UID-" + crypto.randomBytes(4).toString("hex");

/* ============================================
   Send OTP to User's Email
============================================ */
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Generate 6-digit OTP and set 2-minute expiry
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 2 * 60 * 1000);

    // Upsert OTP record in DB
    await Otp.findOneAndUpdate(
      { email },
      { otp, expiry },
      { upsert: true, new: true }
    );

    // Send OTP via email
    await sendEmail(
      email,
      "Your OTP of Authentication Application",
      `Your OTP is: ${otp}, which is valid for only 2 minutes.`
    );
    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/* ============================================
   Verify OTP for a given email
============================================ */
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = await Otp.findOne({ email });

    // Check if OTP matches and has not expired
    if (!record || record.otp !== otp || record.expiry < new Date()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    res.json({ message: "OTP verified" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/* ============================================
   Signup a new user after verifying OTP
============================================ */
export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, password, otp } = req.body;
    const record = await Otp.findOne({ email });

    // Validate OTP
    if (!record || record.otp !== otp || record.expiry < new Date()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Prevent duplicate registration
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      userId: generateUserId(),
      firstName,
      lastName,
      email,
      mobile,
      password: hashedPassword,
      isVerified: true,
    });

    await user.save(); // Save user to DB
    await Otp.deleteOne({ email }); // Remove OTP after successful registration

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/* ============================================
   Login user with email & password + retry limit
============================================ */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const now = Date.now();

    // Block login after 3 failed attempts within 3 hours
    if (
      user.loginAttempts >= 3 &&
      user.lastLoginAttempt &&
      now - user.lastLoginAttempt < 3 * 60 * 60 * 1000
    ) {
      return res
        .status(429)
        .json({ error: "Too many attempts. Please try again after 3 hours." });
    }

    // Compare hashed password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      user.loginAttempts += 1;
      user.lastLoginAttempt = new Date();
      await user.save();
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Reset login attempt count after success
    user.loginAttempts = 0;
    user.lastLoginAttempt = null;
    await user.save();

    // Generate JWT token valid for 1 hour
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token }); // Send token to client
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/* ============================================
   Get current logged-in user's profile
============================================ */
export const getUser = async (req, res) => {
  try {
    // `req.user` is set by the auth middleware (after verifying token)
    const user = await User.findOne({ userId: req.user.userId }).select(
      "-password" // Exclude password field from response
    );
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/* ============================================
   Update password for authenticated user
============================================ */
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Find the user by ID extracted from token
    const user = await User.findOne({ userId: req.user.userId });

    // Check current password
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid)
      return res.status(400).json({ error: "Incorrect current password" });

    // Hash and update new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
