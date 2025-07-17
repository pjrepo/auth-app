// Import Mongoose for schema and model creation
import mongoose from "mongoose";

// Destructured Schema and model from mongoose
const { Schema, model } = mongoose;

// Define the schema for storing OTPs
const otpSchema = new Schema({
  email: String, // User's email address to which the OTP was sent
  otp: String, // The actual OTP value (6-digit string)
  expiry: Date, // Expiration timestamp for the OTP (e.g: 2 minutes validity)
});

// Create a Mongoose model named "Otp" based on the schema
const Otp = model("Otp", otpSchema);

export default Otp;
