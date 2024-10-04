const { Schema, model, models } = require("mongoose");

const StoreUser = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  appartment: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  ZIP: { type: String, required: true },
  phNo: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  otp: { type: String }, // Store OTP temporarily for verification
  otpExpiresAt: { type: Date }, // TTL index to expire after 10 mins (600 seconds)
  createdAt: { type: Date, default: Date.now, expires: '10m' }, // Automatically delete after 10 minutes
});

// Create TTL index on createdAt field to automatically remove unverified users after 10 minutes
StoreUser.index({ createdAt: 1, verified: false });

module.exports = models.StoreUser || model("StoreUser", StoreUser);
