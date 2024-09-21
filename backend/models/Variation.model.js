const { Schema, model, models } = require('mongoose');

const VariationSchema = new Schema({
  type: {
    type: String,
    required: true, // e.g., "SIZES", "COLOR", "STORAGE"
  },
  options: {
    type: [String], // Array of strings for the options
    required: true,
  },
});

module.exports = models.Variation || model("Variation", VariationSchema);