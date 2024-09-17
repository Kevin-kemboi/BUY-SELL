const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const fetchStoreUser = require("../middleware/fetchStoreUser");
const Product = require("../models/Product.model");
const Cart = require("../models/Cart.model");

// Add item to cart
router.post("/add", fetchStoreUser, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Use findOneAndUpdate with upsert to create or update the cart
    // This eliminates the need for a separate getOrCreateCart function
    // Update the cart by finding if the product already exists in the cart
    const cart = await Cart.findOneAndUpdate(
      {
        user: userId,
        "items.products": productId, // Check if the product already exists
      },
      {
        $inc: { "items.$.quantity": quantity }, // Increment the quantity of the existing product
      },
      { new: true } // Return the updated cart
    );

    if (!cart) {
      // If the product doesn't exist, push it as a new item
      const updatedCart = await Cart.findOneAndUpdate(
        { user: userId },
        {
          $push: {
            items: { products: productId, quantity },
          },
        },
        {
          upsert: true, // Create the cart if it doesn't exist
          new: true,
        }
      ).populate("items.products");
      // Calculate total price
      const totalPrice = updatedCart.items.reduce((acc, item) => {
        return acc + item.products.price * item.quantity;
      }, 0);

      return res.status(200).json({ success: true, cart: updatedCart, totalPrice });
    }

    // Return the updated cart with the incremented quantity
    const populatedCart = await Cart.findOne({ user: userId }).populate(
      "items.products"
    );

     // Calculate total price
     const totalPrice = populatedCart.items.reduce((acc, item) => {
      return acc + item.products.price * item.quantity;
    }, 0);

    res.status(200).json({
      message: "Item added to cart successfully",
      cart: populatedCart,
      totalPrice
    });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res
      .status(500)
      .json({ message: "Error adding item to cart", error: error.message });
  }
});

router.post("/remove", fetchStoreUser, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    // Validate product exists in the database
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find the cart and check if the product exists in the cart
    const cart = await Cart.findOne({
      user: userId,
      "items.products": productId, // Check if the product exists in the cart
    });

    if (!cart) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Find the item in the cart
    const cartItem = cart.items.find((item) => item.products.equals(productId));

    if (!cartItem || cartItem.quantity <= quantity) {
      // If the quantity to remove is greater or equal to the current quantity, remove the item entirely
      const updatedCart = await Cart.findOneAndUpdate(
        { user: userId },
        { $pull: { items: { products: productId } } }, // Remove the item from the cart
        { new: true }
      ).populate("items.products");

      // Calculate total price
      const totalPrice = updatedCart.items.reduce((acc, item) => {
        return acc + item.products.price * item.quantity;
      }, 0);

      return res.status(200).json({
        success: true,
        message: "Item removed from cart",
        cart: updatedCart,
        totalPrice
      });
    } else {
      // Decrease the quantity
      const updatedCart = await Cart.findOneAndUpdate(
        {
          user: userId,
          "items.products": productId, // Check if the product exists in the cart
        },
        {
          $inc: { "items.$.quantity": -quantity }, // Decrease the quantity
        },
        { new: true }
      ).populate("items.products");

      // Calculate total price
      const totalPrice = updatedCart.items.reduce((acc, item) => {
        return acc + item.products.price * item.quantity;
      }, 0);

      return res.status(200).json({
        success: true,
        message: "Item quantity updated",
        cart: updatedCart,
        totalPrice
      });
    }
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({
      message: "Error removing item from cart",
      error: error.message,
    });
  }
});

// Remove item from cart
router.delete("/clearcart/:productId", fetchStoreUser, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    // Find the cart and remove the specific item
    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { items: { products: productId } } }, // Remove item with matching productId
      { new: true } // Return the updated document
    ).populate("items.products"); // Populate product details

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res
      .status(500)
      .json({ message: "Error removing item from cart", error: error.message });
  }
});

// Get current cart contents
router.get("/cart", fetchStoreUser, async (req, res) => {
  try {
    const userId = req.user._id;

    // Use aggregation pipeline to get cart with product details and total price
    const cart = await Cart.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } }, // Find cart for user
      { $unwind: "$items" }, // Deconstruct items array
      {
        $lookup: {
          // Join with products collection
          from: "products",
          localField: "items.products",
          foreignField: "_id",
          as: "items.productDetails",
        },
      },
      { $unwind: "$items.productDetails" }, // Deconstruct productDetails array
      {
        $group: {
          // Reconstruct cart with additional info
          _id: "$_id",
          user: { $first: "$user" },
          items: {
            $push: {
              products: "$items.productDetails",
              quantity: "$items.quantity",
            },
          },
          totalPrice: {
            // Calculate total price
            $sum: {
              $multiply: ["$items.quantity", "$items.productDetails.price"],
            },
          },
        },
      },
    ]);

    if (!cart.length) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ cart: cart[0] });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res
      .status(500)
      .json({ message: "Error fetching cart", error: error.message });
  }
});

module.exports = router;

module.exports = router;
