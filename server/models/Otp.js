import mongoose from "mongoose";

const { Schema, model } = mongoose;

const otpSchema = new Schema({
  email: String,
  otp: String,
  expiry: Date,
});

const Otp = model("Otp", otpSchema);

export default Otp;
