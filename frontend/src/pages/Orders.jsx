import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyOrders } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import OrderCard from "../components/OrderCard.jsx";

const Orders = () => {
  const { customer, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !customer) {
      navigate("/login");
      return;
    }
    if (customer) {
      fetchOrders();
    }
  }, [customer, authLoading]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getMyOrders();
      if (res.success && Array.isArray(res.orders)) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.error("Orders fetch error:", err);
      setError("Unable to load your orders.");
    } finally {
      setLoading(false);
    }
  };

  // Loading State - Lab 06 Section 16
  if (loading || authLoading) {
    return (
      <div className="main-content">
        <div className="state-container">
          <div className="spinner"></div>
          <p className="state-title">Loading your orders...</p>
        </div>
      </div>
    );
  }

  // Error State - Lab 06 Section 16
  if (error) {
    return (
      <div className="main-content">
        <div className="state-container">
          <div className="state-icon">⚠️</div>
          <h3 className="state-title">{error}</h3>
          <button onClick={fetchOrders} className="btn-primary">
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
          My Orders 📦
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Track past orders and view payment snapshots
        </p>
      </div>

      {/* Empty State - Lab 06 Section 16 */}
      {orders.length === 0 ? (
        <div className="state-container">
          <div className="state-icon">📦</div>
          <h2 className="state-title">You have not placed any orders yet.</h2>
          <p className="state-subtitle">Start browsing products and fill your cart today.</p>
          <Link to="/products" className="btn-primary" style={{ padding: "0.8rem 1.75rem" }}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
