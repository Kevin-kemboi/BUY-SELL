const express = require("express");
const router = express.Router();
const AdminUser = require("../models/AdminUser.model");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchAdminUser = require("../middleware/fetchAdminUser");
const isAdmin = require("../middleware/AdminVerify");
const Product = require("../models/Product.model");
const upload = require("../middleware/Upload");

const secret = process.env.JWT_SECRET;
console.log(secret)
// ----------------------------------------
// Admin auth routes
// ----------------------------------------
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

// --------------------------------------------
// Product Routes
// --------------------------------------------

// add a product
router.post(
  "/addproduct",
  fetchAdminUser,
  isAdmin,
  upload.single("imageFile"), // Use upload middleware to handle the file
  [
    // Validation middleware here...
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    try {

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
  
      const { filename } = req.file; // This should be defined now
      // You can proceed with saving product information to the database
      // For exampl

      let product = await Product.findOne({ name: req.body.name });
      if (product) {
        return res.status(400).json({ error: "Product name already exists" });
      }

      // Save the product with the image URL (filename stored in GridFS)
      product = await Product.create({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        stock: req.body.stock,
        imageUrl: filename, // Store the image filename as imageUrl in the database
      });

      res.status(200).json({ success: true, product });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "internal server error" });
    }
  }
);

// update a product
router.put(
  "/updateproduct/:id",
  fetchAdminUser,
  isAdmin,
  [
    body("name")
      .isString()
      .isLength({ min: 1 })
      .withMessage(
        "Product name is required and should be a non-empty string."
      ),
    body("description")
      .isString()
      .isLength({ min: 1 })
      .withMessage(
        "Product description is required and should be a non-empty string."
      ),
    body("price")
      .isFloat({ min: 0 })
      .withMessage(
        "Price is required and should be a number greater than or equal to 0."
      ),
    body("category")
      .isString()
      .isLength({ min: 1 })
      .withMessage("Category is required and should be a non-empty string."),
    body("stock")
      .isInt({ min: 0 })
      .withMessage(
        "Stock is required and should be an integer greater than or equal to 0."
      ),
    body("imageUrl")
      .optional()
      .isURL()
      .withMessage("Image URL should be a valid URL."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, description, price, category, stock, imageUrl } = req.body;

    try {
      let product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found." });
      }
      product = await Product.findByIdAndUpdate(
        id,
        {
          name,
          description,
          price,
          category,
          stock,
          imageUrl,
        },
        { new: true }
      );

      res.status(200).json({ success: true, product });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "server error" });
    }
  }
);

//delete a product
router.delete(
  "/deleteproduct/:id",
  fetchAdminUser,
  isAdmin,
  async (req, res) => {
    const { id } = req.params;

    try {
      // Check if the product exists
      let product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Delete the product
      await Product.findByIdAndDelete(id);

      res
        .status(200)
        .json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// get products, 4 at a time
router.get("/productslist", async (req, res) => {
  const page = req.header("Page");
  let pageSize;
  if (page) {
    pageSize = 4;
  }

  try {
    const products = await Product.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const totalCount = await Product.countDocuments({});

    res.status(200).json({ success: true, products, totalCount });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// get a product by id
router.post("/getproductbyid", fetchAdminUser, isAdmin, async (req, res) => {
  const { id } = req.body;
  try {
    const product = await Product.findById(id);
    if (!product) throw new Error();
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
