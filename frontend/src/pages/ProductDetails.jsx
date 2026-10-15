import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById, addToWishlist } from "../services/api.js";
import { useCart } from "../context/CartContext.jsx";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart, cartItems } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartAdding, setCartAdding] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [wishlistSaved, setWishlistSaved] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProductById(id);
      setProduct(data);
    } catch (err) {
      console.error("Product fetch error:", err);
      setError("Product not found or unavailable.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product || product.stock <= 0 || cartAdding) return;
    setCartAdding(true);
    const res = await addToCart(product._id);
    setCartAdding(false);
    if (res.success) {
      setCartSuccess(true);
      setTimeout(() => setCartSuccess(false), 2500);
    } else {
      alert(res.message);
    }
  };

  const handleWishlist = async () => {
    try {
      const res = await addToWishlist(product._id);
      if (res.success) {
        setWishlistSaved(true);
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setWishlistSaved(true);
      } else {
        alert(err.response?.data?.message || "Failed to add to wishlist");
      }
    }
  };

  if (loading) {
    return (
      <div className="state-container">
        <div className="spinner"></div>
        <p className="state-title">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="state-container">
        <div className="state-icon">⚠️</div>
        <h3 className="state-title">{error || "Product Not Found"}</h3>
        <p className="state-subtitle">We couldn't locate this item.</p>
        <Link to="/products" className="btn-primary">
          Back to Products
        </Link>
      </div>
    );
  }

  const inCart = cartItems.some((item) => item.product?._id === product._id);

  return (
    <div className="main-content">
      <div style={{ marginBottom: "1.5rem" }}>
        <Link to="/products" style={{ color: "var(--primary)", fontWeight: 600, fontSize: "0.9rem" }}>
          ← Back to Products
        </Link>
      </div>

      <div
        style={{
          background: "#ffffff",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "2.5rem 2rem",
          boxShadow: "var(--shadow-sm)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "3rem",
          alignItems: "center"
        }}
      >
        {/* Large Product Image */}
        <div
          style={{
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            background: "#f8fafc",
            maxHeight: "440px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "100%", maxHeight: "440px", objectFit: "cover" }}
          />
        </div>

        {/* Product Details info */}
        <div>
          <span className="product-category-badge">{product.category}</span>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: "0.5rem 0 1rem", color: "var(--text-main)" }}>
            {product.name}
          </h1>

          <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "1.5rem" }}>
            <span style={{ fontSize: "2rem", fontWeight: 800, color: "var(--primary)" }}>
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            <span
              className={`stock-status ${
                product.stock > 5 ? "in-stock" : product.stock > 0 ? "low-stock" : "out-of-stock"
              }`}
              style={{ fontSize: "0.95rem" }}
            >
              {product.stock > 0 ? `In Stock (${product.stock} units left)` : "Out of Stock"}
            </span>
          </div>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.25rem", marginBottom: "1.75rem" }}>
            <h4 style={{ fontSize: "0.95rem", color: "var(--text-muted)", marginBottom: "0.5rem", textTransform: "uppercase" }}>
              Description
            </h4>
            <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--text-main)" }}>
              {product.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
            <button
              onClick={handleAddToCart}
              disabled={cartAdding || product.stock <= 0}
              className="btn-primary"
              style={{ padding: "0.85rem 2rem", fontSize: "1.05rem" }}
            >
              {cartAdding
                ? "Adding..."
                : cartSuccess
                ? "✓ Added to Cart!"
                : product.stock <= 0
                ? "Out of Stock"
                : inCart
                ? "Add Another to Cart"
                : "Add to Cart 🛒"}
            </button>

            <button
              onClick={handleWishlist}
              className={`btn-outline ${wishlistSaved ? "saved" : ""}`}
              style={{ padding: "0.85rem 1.5rem" }}
            >
              {wishlistSaved ? "♥ Saved in Wishlist" : "♡ Save to Wishlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
