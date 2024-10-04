const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const StoreUser = require("../models/StoreUser.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchStoreUser = require("../middleware/fetchStoreUser");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const secret = process.env.JWT_SECRET;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_ROUTE,
  },
});

router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find the user by email
    const user = await StoreUser.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found." });
    }

    // Check if OTP has expired
    if (Date.now() > user.otpExpiry) {
      return res
        .status(400)
        .json({ error: "OTP has expired. Please request a new one." });
    }

    // Check if the provided OTP matches the stored OTP
    if (user.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP." });
    }

    // Set the user to verified and clear OTP fields
    user.verified = true;
    user.otp = undefined; // Clear the OTP
    user.otpExpiry = undefined; // Clear the OTP expiry
    await user.save();
    // Generate the auth token now that the user is verified
    const data = {
      user: {
        id: user.id,
      },
    };

    const authToken = jwt.sign(data, secret);

    res.json({ success: true, authToken });
  } catch (error) {
    console.error("Error verifying OTP:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(
  "/signup",
  [
    body("name").isLength({ min: 1 }).withMessage("Name can't be empty"),
    body("address").isLength({ min: 1 }),
    body("appartment").isLength({ min: 1 }),
    body("city").isLength({ min: 1 }),
    body("state").isLength({ min: 1 }),
    body("ZIP").isLength({ min: 1 }),
    body("phNo").isLength({ min: 10 }),
    body("email").isEmail(),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    try {
      // Check if user already exists
      let user = await StoreUser.findOne({
        $or: [{ phNo: req.body.phNo }, { email: req.body.email }],
      });

      if (user) {
        return res
          .status(400)
          .json({ error: "Phone number or email already exists." });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const securedPassword = await bcrypt.hash(req.body.password, salt);

      // Generate a 6-digit OTP
      const otp = crypto.randomInt(100000, 999999).toString();

      // Set OTP expiry to 10 minutes from now
      const otpExpiresAt = Date.now() + 10 * 60 * 1000;

      // Send OTP via email
      const mailOptions = {
        from: '"Zin Store" zzzzlynx@gmail.com',
        to: req.body.email,
        subject: "OTP Verification",
        text: `Your OTP code is: ${otp}. It expires in 10 minutes.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).json({ error: "Error sending OTP." });
        }
      });

      // Create the user in the database with verified: false and otp
      user = new StoreUser({
        name: req.body.name,
        address: req.body.address,
        appartment: req.body.appartment,
        city: req.body.city,
        state: req.body.state,
        ZIP: req.body.ZIP,
        phNo: req.body.phNo,
        email: req.body.email,
        password: securedPassword,
        verified: false, // User is initially not verified
        otp, // Store the generated OTP
        otpExpiresAt, // Store OTP expiry time
      });

      // Save the user
      await user.save();

      res.status(200).json({
        success: true,
        message: "OTP sent. Please verify your email.",
        email: req.body.email,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    try {
      const user = await StoreUser.findOne({
        email: req.body.email,
      });

      if (!user) {
        return res.status(400).json({ error: "User does not exist." });
      }

      // Check if the user is verified
      if (!user.verified) {
        return res.status(400).json({ error: "User not verified. Please verify your email." });
      }

      // Compare the password
      const passwordCompare = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!passwordCompare) {
        return res.status(400).json({ error: "Invalid credentials." });
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, secret);

      res.status(200).json({ success: true, authToken });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  }
);


router.get("/userinfo", fetchStoreUser, async (req, res) => {
  try {
    const user = req.user;
    res.json({ user, success: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "internal server error" });
  }
});

module.exports = router;
