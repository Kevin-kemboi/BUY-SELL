const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchAdminUser = require("../middleware/fetchAdminUser");
const isAdmin = require("../middleware/AdminVerify");
const Product = require("../models/Product.model");
const upload = require("../middleware/storage");


// --------------------------------------------
// Product Routes
// --------------------------------------------

router.post("/api/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({ error: err.message || "Upload failed" });
    }
    if (!req.file) {
      console.error("No file uploaded");
      return res.status(400).json({ error: "No file uploaded" });
    }
    console.log("File uploaded successfully:", req.file);
    res.json({
      filename: req.file.filename,
      filepath: `http://localhost:5173/uploads/${req.file.filename}`,
    });
  });
});

// add a product
router.post(
  "/addproduct",
  fetchAdminUser,
  isAdmin,
  // Use upload middleware to handle the file
  [
    // Validation middleware here...
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    try {
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
        imageUrl: req.body.imageUrl, // Store the image filename as imageUrl in the database
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
  try {
    const page = req.header("Page");
    const pageSize = page ? 4 : null;

    const filter = req.header("Filter");
    const sortBy = req.header("Sort");

    // Define a query object
    const query = {};

    // Only add filtering logic if a filter is provided
    if (filter) {
      query.$or = [
        { category: { $regex: new RegExp(`^${filter}$`, "i") } }, // Match category
      ];
    }

    let sortOptions = {};

    switch (sortBy) {
      case "latest":
        sortOptions = { createdAt: -1 };
        break;

      case "high":
        sortOptions = { price: -1 };
        break;

      case "low":
        sortOptions = { price: 1 };
        break;

      default:
        sortOptions = {createdAt: 1 }
        break;
    }

    // Fetch products with optional pagination
    const products = await Product.find(query)
      .skip(page ? (page - 1) * pageSize : 0)
      .limit(pageSize || 0)
      .sort(sortOptions || {});

    // Get total count of products (use the same filter query for accurate count)
    const totalCount = await Product.countDocuments(query);

    res.status(200).json({ success: true, products, totalCount });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// get a product by id
router.post("/getproductbyid", async (req, res) => {
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
