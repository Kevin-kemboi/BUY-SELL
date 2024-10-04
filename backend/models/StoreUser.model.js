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
  verified: { type: Boolean, default: false }, // Add verified field
  otp: { type: String }, // Store OTP temporarily for verification
  otpExpiresAt: { type: Date, expires: 600 }, // TTL index to expire after 10 mins (600 seconds)
});

// Create TTL index on otpExpiresAt field to automatically remove expired users
StoreUser.index({ otpExpiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = models.StoreUser || model("StoreUser", StoreUser);
