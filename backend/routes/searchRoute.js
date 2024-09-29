const express = require("express");
const router = express.Router();
const Product = require("../models/Product.model");
const VariationModel = require("../models/Variation.model");

router.post("/search", async (req, res) => {
  try {
    const { query } = req.body;

    const regexQuery = { $regex: query, $options: "i" };

    let results = [];

    const modelsAndTypes = [
      {
        model: Product,
        searchFields: ["name", "description", "category"], // Multiple fields to search
      },
    ];

    for (const { model, searchFields } of modelsAndTypes) {
      const queryResults = await model
        .find({
          $or: searchFields.map((field) => ({ [field]: regexQuery })),
        })
        .limit(6);

      results.push(
        ...queryResults.map((item) => ({
            title: `${item.name} - ${item.category}`,
            id: item._id,
        }))
      );
    }

    res.status(200).json({ results, success: true });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
