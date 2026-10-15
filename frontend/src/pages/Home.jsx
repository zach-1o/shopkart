import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const Home = () => {
  const { customer, loading } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  // If not logged in -> automatically redirect to /login (Lab 02 Task 3 requirement)
  useEffect(() => {
    if (!loading && !customer) {
      navigate("/login");
    }
  }, [customer, loading, navigate]);

  if (loading) {
    return (
      <div className="state-container">
        <div className="spinner"></div>
        <p className="state-title">Loading your profile...</p>
      </div>
    );
  }

  if (!customer) return null;

  return (
    <div className="main-content">
      {/* Welcome Banner as specified in Lab 02 Task 3 */}
      <div
        style={{
          background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
          color: "white",
          borderRadius: "var(--radius-lg)",
          padding: "2.5rem 2rem",
          marginBottom: "2.5rem",
          boxShadow: "var(--shadow-lg)"
        }}
      >
        <span style={{ fontSize: "0.9rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.9 }}>
          Welcome back to ShopKart
        </span>
        <h1 style={{ fontSize: "2.25rem", fontWeight: 800, marginTop: "0.25rem", marginBottom: "0.75rem" }}>
          Hello, {customer.fullName}! 👋
        </h1>
        <p style={{ fontSize: "1.05rem", opacity: 0.95, maxWidth: "600px" }}>
          Your customer account is active and verified. Discover the newest electronics, fashion, and home products.
        </p>
      </div>

      {/* Profile Details Card - Lab 02 Task 3 Display Requirements */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
          marginBottom: "3rem"
        }}
      >
        <div
          style={{
            background: "#ffffff",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "1.5rem",
            boxShadow: "var(--shadow-sm)"
          }}
        >
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", color: "var(--text-main)" }}>
            👤 Customer Information
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.95rem" }}>
            <div>
              <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.82rem" }}>FULL NAME</span>
              <strong style={{ color: "var(--text-main)" }}>{customer.fullName}</strong>
            </div>
            <div>
              <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.82rem" }}>EMAIL ADDRESS</span>
              <strong style={{ color: "var(--text-main)" }}>{customer.email}</strong>
            </div>
            <div>
              <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.82rem" }}>PHONE NUMBER</span>
              <strong style={{ color: "var(--text-main)" }}>{customer.phone}</strong>
            </div>
            <div>
              <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.82rem" }}>CUSTOMER ID</span>
              <code style={{ fontSize: "0.8rem", background: "#f1f5f9", padding: "0.2rem 0.4rem", borderRadius: "4px" }}>
                {customer._id}
              </code>
            </div>
          </div>
        </div>

        {/* Quick Jump Modules */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "1.5rem",
            boxShadow: "var(--shadow-sm)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              🛍️ Continue Shopping
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", marginBottom: "1.25rem" }}>
              Browse our curated product catalogue, filter by categories, and manage your wishlist.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link to="/products" className="btn-primary">
              Explore Products →
            </Link>
            <Link to="/cart" className="btn-secondary">
              View Cart ({cartCount})
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
