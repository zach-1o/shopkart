import React, { useState } from "react";
import { Link } from "react-router-dom";
import { addToWishlist } from "../services/api.js";
import { useCart } from "../context/CartContext.jsx";

const ProductCard = ({ product, isWishlisted = false, onWishlistChange }) => {
  const { addToCart, cartItems } = useCart();
  const [wishlistState, setWishlistState] = useState(isWishlisted ? "added" : "default"); // "default" | "saving" | "added"
  const [cartAdding, setCartAdding] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  const inCart = cartItems.some((item) => item.product?._id === product._id);

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    if (wishlistState === "saving") return;

    setWishlistState("saving");
    try {
      const res = await addToWishlist(product._id);
      if (res.success) {
        setWishlistState("added");
        if (onWishlistChange) onWishlistChange(product._id, true);
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setWishlistState("added");
      } else {
        alert(err.response?.data?.message || "Unable to save to wishlist");
        setWishlistState("default");
      }
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (cartAdding || product.stock <= 0) return;

    setCartAdding(true);
    setCartMessage("");
    const res = await addToCart(product._id);
    setCartAdding(false);

    if (res.success) {
      setCartMessage("Added!");
      setTimeout(() => setCartMessage(""), 1800);
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="product-card">
      <div className="product-card-image-wrap">
        <img src={product.image} alt={product.name} className="product-card-image" />
        <button
          className={`wishlist-btn-overlay ${wishlistState === "added" ? "saved" : ""}`}
          onClick={handleWishlistClick}
          title={wishlistState === "added" ? "Saved to Wishlist" : "Add to Wishlist"}
        >
          {wishlistState === "saving" ? "⏳" : wishlistState === "added" ? "♥" : "♡"}
        </button>
      </div>

      <div className="product-card-body">
        <span className="product-category-badge">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>

        <div className="product-price-row">
          <span className="product-price">₹{product.price.toLocaleString("en-IN")}</span>
          <span
            className={`stock-status ${
              product.stock > 5 ? "in-stock" : product.stock > 0 ? "low-stock" : "out-of-stock"
            }`}
          >
            {product.stock > 0 ? `${product.stock} units left` : "Out of stock"}
          </span>
        </div>

        <div className="product-card-actions">
          <Link to={`/products/${product._id}`} className="btn-outline" style={{ textAlign: "center" }}>
            View Details
          </Link>

          <button
            onClick={handleAddToCart}
            disabled={cartAdding || product.stock <= 0}
            className="btn-primary"
            style={{ width: "100%" }}
          >
            {cartAdding
              ? "Adding..."
              : cartMessage
              ? "✓ Added"
              : product.stock <= 0
              ? "Out of Stock"
              : inCart
              ? "Add Another"
              : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
