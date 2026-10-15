import mongoose from "mongoose";
import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";

// Task 2: Add Product to Cart API
export const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format"
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const user = await Customer.findById(req.user._id);

    const existingItem = user.cart.find(
      (item) => item.product.toString() === productId.toString()
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + 1;
      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Available stock is ${product.stock}`
        });
      }
      existingItem.quantity = newQuantity;
    } else {
      if (product.stock < 1) {
        return res.status(400).json({
          success: false,
          message: "Product is out of stock"
        });
      }
      user.cart.push({ product: productId, quantity: 1 });
    }

    await user.save();

    // Populate for clean response
    await user.populate({
      path: "cart.product",
      select: "name price image stock"
    });

    return res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: user.cart
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error adding product to cart"
    });
  }
};

// Task 3: Get Current User's Cart API
export const getCart = async (req, res) => {
  try {
    const user = await Customer.findById(req.user._id).populate({
      path: "cart.product",
      select: "name price image stock"
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Filter out items with deleted products
    const validCart = (user.cart || []).filter((item) => item.product !== null);

    return res.status(200).json({
      success: true,
      cart: validCart
    });
  } catch (error) {
    console.error("Get cart error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error retrieving cart"
    });
  }
};

// Task 4: Update Product Quantity API
export const updateQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format"
      });
    }

    const numQuantity = Number(quantity);
    if (isNaN(numQuantity) || numQuantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a number greater than or equal to 1"
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (numQuantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Quantity requested (${numQuantity}) exceeds available stock (${product.stock})`
      });
    }

    const user = await Customer.findById(req.user._id);
    const cartItem = user.cart.find(
      (item) => item.product.toString() === productId.toString()
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Product not in cart"
      });
    }

    cartItem.quantity = numQuantity;
    await user.save();

    await user.populate({
      path: "cart.product",
      select: "name price image stock"
    });

    return res.status(200).json({
      success: true,
      message: "Cart quantity updated",
      cart: user.cart
    });
  } catch (error) {
    console.error("Update quantity error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error updating cart quantity"
    });
  }
};

// Task 5: Remove Product from Cart API
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format"
      });
    }

    const user = await Customer.findById(req.user._id);

    const index = user.cart.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not in cart"
      });
    }

    user.cart.splice(index, 1);
    await user.save();

    await user.populate({
      path: "cart.product",
      select: "name price image stock"
    });

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart: user.cart
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error removing product from cart"
    });
  }
};
