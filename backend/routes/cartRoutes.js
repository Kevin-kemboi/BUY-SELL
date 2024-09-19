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

    // Try to find the cart and check if the product exists in the cart
    const cart = await Cart.findOneAndUpdate(
      {
        user: userId,
        "items.products": productId, // Check if the product already exists in the cart
      },
      {
        $inc: { "items.$.quantity": quantity }, // Increment the quantity of the existing product
      },
      { new: true }
    );

    let updatedItem;
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
      );

      // Find the updated item in the cart
      updatedItem = updatedCart.items.find((item) =>
        item.products.equals(productId)
      );
    } else {
      // Find the updated item in the existing cart
      updatedItem = cart.items.find((item) => item.products.equals(productId));
    }

    // Calculate the total price for the specific product
    const totalPrice = product.price * updatedItem.quantity;

    // Return the quantity and total price of the added/updated product
    return res.status(200).json({
      success: true,
      productId: productId,
      quantity: updatedItem.quantity,
      totalPrice,
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
    const { productId, quantity } = req.body; // Get product ID and quantity from the request body
    const userId = req.user._id; // Get the user ID from the authenticated user

    // Validate if the product exists in the database
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

    // Find the specific item in the cart
    const cartItem = cart.items.find((item) => item.products.equals(productId));

    if (!cartItem) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // If the quantity to remove is greater than or equal to the current quantity, remove the item entirely
    if (cartItem.quantity <= quantity) {
      await Cart.findOneAndUpdate(
        { user: userId },
        { $pull: { items: { products: productId } } } // Remove the item from the cart
      );

      return res.status(200).json({
        success: true,
        message: "Item removed from cart",
        productId: productId,
        quantity: 0, // Quantity is 0 since the item is completely removed
        totalPrice: 0, // Total price is 0 since the item is completely removed
      });
    } else {
      // Decrease the quantity of the product in the cart
      const updatedCart = await Cart.findOneAndUpdate(
        {
          user: userId,
          "items.products": productId, // Check if the product exists in the cart
        },
        {
          $inc: { "items.$.quantity": -quantity }, // Decrease the quantity
        },
        { new: true }
      );

      // Find the updated item again to get its new quantity
      const updatedItem = updatedCart.items.find((item) =>
        item.products.equals(productId)
      );

      // Calculate the total price for the updated product
      const itemTotalPrice = updatedItem.quantity * product.price;

      return res.status(200).json({
        success: true,
        message: "Item quantity updated",
        productId: productId,
        quantity: updatedItem.quantity, // Return the updated quantity
        totalPrice: itemTotalPrice, // Return the updated total price for this specific product
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
router.delete("/clearitem/:productId", fetchStoreUser, async (req, res) => {
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
router.get("/getcart", fetchStoreUser, async (req, res) => {
  try {
    const userId = req.user._id; // Get the user ID from the request

    // Use aggregation pipeline to get cart with product details, total price, and item total
    const cart = await Cart.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } }, // Match the cart to the user
      { $unwind: "$items" }, // Unwind the items array to process each item separately
      {
        $lookup: {
          // Lookup products from the 'products' collection
          from: "products",
          localField: "items.products", // Local field is the product ID in the cart
          foreignField: "_id", // Foreign field is the product ID in the 'products' collection
          as: "items.productDetails", // The matched product details will be in this field
        },
      },
      { $unwind: "$items.productDetails" }, // Unwind the productDetails array to get individual product objects
      {
        $addFields: {
          // Add a field 'itemTotal' which calculates total price for each product
          "items.itemTotal": {
            $multiply: ["$items.quantity", "$items.productDetails.price"],
          },
        },
      },
      {
        $group: {
          // Group back the results to the cart level
          _id: "$_id", // Keep the original cart ID
          user: { $first: "$user" }, // Keep the user ID
          items: {
            $push: {
              products: "$items.productDetails", // The product details
              quantity: "$items.quantity", // The quantity of the product in the cart
              itemTotal: "$items.itemTotal", // The total price for the product (price * quantity)
            },
          },
          totalPrice: {
            // Calculate the total price for the cart
            $sum: "$items.itemTotal", // Sum of all item totals
          },
        },
      },
    ]);

    if (!cart.length) {
      // If no cart found, return a 404 response
      return res.status(404).json({ message: "Cart Empty" });
    }

    // Return the cart and total price
    res.status(200).json({ success: true, cart: cart[0] });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Error fetching cart", error: error.message });
  }
});


module.exports = router;

module.exports = router;
