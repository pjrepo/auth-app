import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema({
  userId: String,
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  mobile: String,
  password: String,
  isVerified: { type: Boolean, default: false },
  loginAttempts: { type: Number, default: 0 },
  lastLoginAttempt: Date,
});

const User = model("User", userSchema);

export default User;
