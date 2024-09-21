const { Schema, model, models } = require("mongoose");

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  stock: { type: Number, required: true, min: 0 },
  imageUrl: { type: String, required: true },
  variations: [{ type: Schema.Types.ObjectId, ref: 'Variation', required: true }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = models.Products || model("Products", ProductSchema);
