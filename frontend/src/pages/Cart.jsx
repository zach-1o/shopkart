import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import CartItem from "../components/CartItem.jsx";
import OrderSummary from "../components/OrderSummary.jsx";

const Cart = () => {
  const { cartItems, cartLoading, cartError, subtotal, refreshCart } = useCart();
  const { customer, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !customer) {
      navigate("/login");
    }
  }, [customer, authLoading, navigate]);

  // Loading State - Lab 05 Section 17
  if (cartLoading || authLoading) {
    return (
      <div className="main-content">
        <div className="state-container">
          <div className="spinner"></div>
          <p className="state-title">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Error State - Lab 05 Section 17
  if (cartError) {
    return (
      <div className="main-content">
        <div className="state-container">
          <div className="state-icon">⚠️</div>
          <h3 className="state-title">Unable to load your cart.</h3>
          <p className="state-subtitle">{cartError}</p>
          <button onClick={refreshCart} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty State - Lab 05 Section 17
  if (cartItems.length === 0) {
    return (
      <div className="main-content">
        <div className="state-container">
          <div className="state-icon">🛒</div>
          <h2 className="state-title">Your cart is empty 🛒</h2>
          <p className="state-subtitle">Looks like you haven't added anything yet.</p>
          <Link to="/products" className="btn-primary" style={{ padding: "0.8rem 1.75rem" }}>
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-main)" }}>
          My Cart 🛒
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Review your items before proceeding to checkout
        </p>
      </div>

      <div className="cart-layout">
        {/* Cart Items List */}
        <div>
          {cartItems.map((item) => (
            <CartItem key={item._id || item.product?._id} item={item} />
          ))}
        </div>

        {/* Order Summary & Checkout Button - Lab 05 Section 13 */}
        <div>
          <OrderSummary
            items={cartItems}
            subtotal={subtotal}
            actionButton={
              <Link
                to="/checkout"
                className="btn-primary"
                style={{
                  display: "block",
                  textAlign: "center",
                  width: "100%",
                  padding: "0.9rem",
                  fontSize: "1.05rem"
                }}
              >
                Proceed to Checkout →
              </Link>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;
