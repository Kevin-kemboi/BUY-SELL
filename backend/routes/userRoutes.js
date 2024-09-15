const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const StoreUser = require("../models/StoreUser.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchStoreUser = require("../middleware/fetchStoreUser");

const secret = process.env.JWT_SECRET;

router.post(
  "/signup",
  [
    body("name").isLength({ min: 1 }).withMessage("name cant be empty"),
    body("address").isLength({ min: 1 }),
    body("appartment").isLength({ min: 1 }),
    body("city").isLength({ min: 1 }),
    body("state").isLength({ min: 1 }),
    body("ZIP").isLength({ min: 1 }),
    body("phNo").isLength({ min: 10 }),
    body("email").isEmail(),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be atleast 8 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    try {
      // check if user with same username and email exists
      let user = await StoreUser.findOne({
        $or: [{ phNo: req.body.phNo }, { email: req.body.email }],
      });

      if (user) {
        return res.status(400).json({ error: "phno or email already exists." });
      }

      // if passes checks, generate salt for password
      const salt = await bcrypt.genSalt(10);
      const securedPassword = await bcrypt.hash(req.body.password, salt);

      // create new user
      user = await StoreUser.create({
        name: req.body.name,
        address: req.body.address,
        appartment: req.body.appartment,
        city: req.body.city,
        state: req.body.state,
        ZIP: req.body.ZIP,
        phNo: req.body.phNo,
        email: req.body.email,
        password: securedPassword,
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

router.get("/userinfo", fetchStoreUser,  async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "internal server error" });
  }
});

module.exports = router;
