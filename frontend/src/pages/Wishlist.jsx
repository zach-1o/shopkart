import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getWishlist, removeFromWishlist } from "../services/api.js";
import WishlistCard from "../components/WishlistCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Wishlist = () => {
  const { customer, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !customer) {
      navigate("/login");
      return;
    }
    if (customer) {
      fetchWishlist();
    }
  }, [customer, authLoading]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getWishlist();
      if (res.success && Array.isArray(res.wishlist)) {
        setWishlist(res.wishlist);
      }
    } catch (err) {
      console.error("Wishlist load error:", err);
      setError("We couldn't load your wishlist.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      const res = await removeFromWishlist(productId);
      if (res.success) {
        setWishlist((prev) => prev.filter((p) => p._id !== productId));
      }
    } catch (err) {
      alert("Failed to remove item from wishlist");
    }
  };

  // Loading State - Lab 04 Section 10
  if (loading || authLoading) {
    return (
      <div className="main-content">
        <div className="state-container">
          <div className="spinner"></div>
          <p className="state-title">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  // Error State - Lab 04 Section 11
  if (error) {
    return (
      <div className="main-content">
        <div className="state-container">
          <div className="state-icon">⚠️</div>
          <h3 className="state-title">Something went wrong.</h3>
          <p className="state-subtitle">{error}</p>
          <button onClick={fetchWishlist} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-main)" }}>
          My Wishlist ❤️
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          {wishlist.length} {wishlist.length === 1 ? "product" : "products"} saved
        </p>
      </div>

      {/* Empty State - Lab 04 Section 9 */}
      {wishlist.length === 0 ? (
        <div className="state-container">
          <div className="state-icon">❤️</div>
          <h2 className="state-title">Your wishlist is empty</h2>
          <p className="state-subtitle">Save products you love and find them here later.</p>
          <Link to="/products" className="btn-primary" style={{ padding: "0.8rem 1.75rem" }}>
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="product-grid">
          {wishlist.map((product) => (
            <WishlistCard key={product._id} product={product} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
