const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const fetchStoreUser = require("../middleware/fetchStoreUser");
const Product = require("../models/Product.model");
const Cart = require("../models/Cart.model");



// Add item to cart
router.post('/add', fetchStoreUser, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Use findOneAndUpdate with upsert to create or update the cart
    // This eliminates the need for a separate getOrCreateCart function
    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { 
        $push: { 
          items: { 
            $each: [{ product: productId, quantity }],
            $position: 0  // Add new item to the beginning of the array
          }
        }
      },
      { 
        upsert: true,  // Create a new document if it doesn't exist
        new: true,     // Return the modified document
        setDefaultsOnInsert: true  // Apply default values if creating a new document
      }
    ).populate('items.product');  // Populate product details

    res.status(200).json({ message: 'Item added to cart successfully', cart });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ message: 'Error adding item to cart', error: error.message });
  }
});

// Update item quantity in cart
router.put('/update', fetchStoreUser, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    // Find the cart and update the quantity of the specific item
    const cart = await Cart.findOneAndUpdate(
      { user: userId, 'items.product': productId },  // Find cart with matching user and product
      { $set: { 'items.$.quantity': quantity } },    // Update quantity of matched item
      { new: true }  // Return the updated document
    ).populate('items.product');  // Populate product details

    if (!cart) {
      return res.status(404).json({ message: 'Cart or item not found' });
    }

    res.status(200).json({ message: 'Cart updated successfully', cart });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: 'Error updating cart', error: error.message });
  }
});

// Remove item from cart
router.delete('/remove/:productId', fetchStoreUser, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    // Find the cart and remove the specific item
    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { items: { product: productId } } },  // Remove item with matching productId
      { new: true }  // Return the updated document
    ).populate('items.product');  // Populate product details

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json({ message: 'Item removed from cart successfully', cart });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ message: 'Error removing item from cart', error: error.message });
  }
});

// Clear entire cart
router.delete('/clear', fetchStoreUser, async (req, res) => {
  try {
    const userId = req.user._id;

    // Find the cart and set its items to an empty array
    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $set: { items: [] } },  // Set items to an empty array
      { new: true }  // Return the updated document
    );

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json({ message: 'Cart cleared successfully', cart });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Error clearing cart', error: error.message });
  }
});

// Get current cart contents
router.get('/cart', fetchStoreUser, async (req, res) => {
  try {
    const userId = req.user._id;

    // Use aggregation pipeline to get cart with product details and total price
    const cart = await Cart.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },  // Find cart for user
      { $unwind: '$items' },  // Deconstruct items array
      { 
        $lookup: {  // Join with products collection
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'items.productDetails'
        }
      },
      { $unwind: '$items.productDetails' },  // Deconstruct productDetails array
      {
        $group: {  // Reconstruct cart with additional info
          _id: '$_id',
          user: { $first: '$user' },
          items: { 
            $push: {
              product: '$items.productDetails',
              quantity: '$items.quantity'
            }
          },
          totalPrice: {  // Calculate total price
            $sum: { $multiply: ['$items.quantity', '$items.productDetails.price'] } 
          }
        }
      }
    ]);

    if (!cart.length) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json({ cart: cart[0] });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
});

module.exports = router;

module.exports = router;
