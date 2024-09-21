// ----------------------------------------
// Admin auth routes
// ----------------------------------------
const AdminUser = require("../models/AdminUser.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchAdminUser = require("../middleware/fetchAdminUser");
const isAdmin = require("../middleware/AdminVerify");

// admin signup
router.post(
  "/signup",
  [
    body("username")
      .isLength({ min: 3 })
      .withMessage("username must me atleast 3 characters"),
    body("email").isEmail(),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be atleast 8 characters"),
    body("role")
      .isString()
      .custom((roles) => {
        const validRoles = "admin";
        if (validRoles === roles) {
          return validRoles;
        }
      })
      .withMessage("Invalid role provided"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    try {
      // check if user with same username and email exists
      let user = await AdminUser.findOne({
        $or: [{ username: req.body.username }, { email: req.body.email }],
      });

      if (user) {
        return res
          .status(400)
          .json({ error: "username or email already exists." });
      }

      // if passes checks, generate salt for password
      const salt = await bcrypt.genSalt(10);
      const securedPassword = await bcrypt.hash(req.body.password, salt);

      // create new user
      user = await AdminUser.create({
        username: req.body.username,
        email: req.body.email,
        password: securedPassword,
        role: req.body.role,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, secret);

      res.json({ success: true, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send(error.message);
    }
  }
);

// admin login
router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    try {
      const user = await AdminUser.findOne({
        email: req.body.email,
        role: "admin",
      });
      if (!user) {
        return res.status(400).json({ error: "User does not exist." });
      }

      const passwordCompare = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!passwordCompare) {
        return res.status(400).json({ error: "invalid credentials" });
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

router.get("/userinfo", fetchAdminUser, isAdmin, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "internal server error" });
  }
});

// new admin register
router.post(
  "/register",
  fetchAdminUser,
  isAdmin,
  [
    body("username")
      .isLength({ min: 3 })
      .withMessage("username must me atleast 3 characters"),
    body("email").isEmail(),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be atleast 8 characters"),
    body("role")
      .isString()
      .custom((roles) => {
        const validRoles = "admin";
        if (validRoles === roles) {
          return validRoles;
        }
      })
      .withMessage("Invalid role provided"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    try {
      // check if user with same username and email exists
      let user = await AdminUser.findOne({
        $or: [{ username: req.body.username }, { email: req.body.email }],
      });

      if (user) {
        return res
          .status(400)
          .json({ error: "username or email already exists." });
      }

      // if passes checks, generate salt for password
      const salt = await bcrypt.genSalt(10);
      const securedPassword = await bcrypt.hash(req.body.password, salt);

      // create new user
      user = await AdminUser.create({
        username: req.body.username,
        email: req.body.email,
        password: securedPassword,
        role: req.body.role,
      });

      res.status(200).json({ success: "User create successfully" });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// get no. of admins
router.get("/getadmins", async (req, res) => {
  try {
    const adminCount = await AdminUser.countDocuments();
    const admins = await AdminUser.find({}).select("-password");
    return res.status(200).json({ success: true, adminCount, admins });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
