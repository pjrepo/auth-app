import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import User from "../models/User.js";
import Otp from "../models/Otp.js";
import sendEmail from "../utils/sendEmail.js";

const generateUserId = () => "UID-" + crypto.randomBytes(4).toString("hex");

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    await Otp.findOneAndUpdate(
      { email },
      { otp, expiry },
      { upsert: true, new: true }
    );

    await sendEmail(
      email,
      "Your OTP of Authentication Application",
      `Your OTP is: ${otp}, which is valid for only 10 minutes.`
    );
    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = await Otp.findOne({ email });

    if (!record || record.otp !== otp || record.expiry < new Date()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    res.json({ message: "OTP verified" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, password, otp } = req.body;
    const record = await Otp.findOne({ email });

    if (!record || record.otp !== otp || record.expiry < new Date()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      userId: generateUserId(),
      firstName,
      lastName,
      email,
      mobile,
      password: hashedPassword,
      isVerified: true,
    });

    await user.save();
    await Otp.deleteOne({ email });

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const now = Date.now();
    if (
      user.loginAttempts >= 3 &&
      user.lastLoginAttempt &&
      now - user.lastLoginAttempt < 3 * 60 * 60 * 1000
    ) {
      return res
        .status(429)
        .json({ error: "Too many attempts. Please try again after 3 hours." });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      user.loginAttempts += 1;
      user.lastLoginAttempt = new Date();
      await user.save();
      return res.status(400).json({ error: "Invalid credentials" });
    }

    user.loginAttempts = 0;
    user.lastLoginAttempt = null;
    await user.save();

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId }).select(
      "-password"
    );
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findOne({ userId: req.user.userId });

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid)
      return res.status(400).json({ error: "Incorrect current password" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
