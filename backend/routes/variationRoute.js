const express = require("express");
const router = express.Router();
const Variation = require("../models/Variation.model");
const fetchAdminUser = require("../middleware/fetchAdminUser");
const isAdmin = require("../middleware/AdminVerify");

// Add a new variation
router.post("/add", fetchAdminUser, isAdmin, async (req, res) => {
  const { type, options } = req.body;

  try {
    const exists = await Variation.find({ type: type });
    if (exists.length > 0) {
     return res
        .status(400)
        .json({ success: false, message: "variation already exits" });
    }

    const variation = await Variation.create({ type, options });
    await variation.save();
    res.status(201).json({ success: true, variation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Update a variation (add/remove options)
router.put("/update/:id", fetchAdminUser, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { options } = req.body; // New options array

  try {
    const variation = await Variation.findByIdAndUpdate(
      id,
      { options },
      { new: true }
    );

    if (!variation) {
      return res
        .status(404)
        .json({ success: false, error: "Variation not found" });
    }

    res.json({ success: true, variation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Delete a variation
router.delete("/delete/:id", fetchAdminUser, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const variation = await Variation.findByIdAndDelete(id);
    if (!variation) {
      return res
        .status(404)
        .json({ success: false, error: "Variation not found" });
    }
    res.json({ success: true, message: "Variation deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Get all variations
router.get("/", async (req, res) => {
  try {
    const variations = await Variation.find();
    res.json({ success: true, variations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

module.exports = router;
