// Import Mongoose for creating schema and model
import mongoose from "mongoose";

// Destructured Schema and model from mongoose
const { Schema, model } = mongoose;

// Define the user schema
const userSchema = new Schema({
  userId: String, // Unique user identifier
  firstName: String, // First name of the user
  lastName: String, // Last name of the user

  // Email
  email: {
    type: String,
    unique: true, // Prevent duplicate registrations with same email
  },
  mobile: String, // Mobile number (stored as string to preserve formatting)
  password: String, // Hashed password

  // Email/identity verification flag
  isVerified: {
    type: Boolean,
    default: false, // By default, user is not verified
  },
  loginAttempts: { type: Number, default: 0 }, // Number of failed login attempts
  lastLoginAttempt: Date, // Timestamp of the most recent login attempt
});

const User = model("User", userSchema);

export default User;
