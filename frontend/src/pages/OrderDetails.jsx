import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById, updateOrderStatus } from "../services/api.js";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getOrderById(id);
      if (res.success && res.order) {
        setOrder(res.order);
      }
    } catch (err) {
      console.error("Order fetch error:", err);
      setError("Unable to load order details.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      const res = await updateOrderStatus(order._id, newStatus);
      if (res.success) {
        setOrder(res.order);
      }
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="state-container">
          <div className="spinner"></div>
          <p className="state-title">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="main-content">
        <div className="state-container">
          <div className="state-icon">⚠️</div>
          <h3 className="state-title">{error || "Order Not Found"}</h3>
          <Link to="/orders" className="btn-primary">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div style={{ marginBottom: "1.5rem" }}>
        <Link to="/orders" style={{ color: "var(--primary)", fontWeight: 600, fontSize: "0.9rem" }}>
          ← Back to My Orders
        </Link>
      </div>

      <div
        style={{
          background: "#ffffff",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "2rem",
          boxShadow: "var(--shadow-sm)",
          maxWidth: "850px",
          margin: "0 auto"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            borderBottom: "1px solid var(--border)",
            paddingBottom: "1.25rem",
            marginBottom: "1.75rem",
            flexWrap: "wrap",
            gap: "1rem"
          }}
        >
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-main)" }}>
              Order #{order._id}
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              Placed on {new Date(order.createdAt).toLocaleString("en-IN")}
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <span className={`badge ${order.paymentStatus === "PAID" ? "badge-paid" : "badge-pending"}`}>
              {order.paymentStatus}
            </span>
            <span className="badge badge-placed">{order.status}</span>
          </div>
        </div>

        {/* Shipping Address Snapshot */}
        <div style={{ marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.75rem" }}>
            📍 Delivery Details
          </h3>
          <div
            style={{
              background: "#f8fafc",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "1.25rem",
              lineHeight: 1.6
            }}
          >
            <strong>{order.shippingAddress?.fullName}</strong> ({order.shippingAddress?.phone})<br />
            {order.shippingAddress?.addressLine1}<br />
            {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
          </div>
        </div>

        {/* Purchased Items Snapshot */}
        <div style={{ marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.75rem" }}>
            🛒 Purchased Items Snapshot
          </h3>
          <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
            {order.items?.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1rem 1.25rem",
                  borderBottom: idx < order.items.length - 1 ? "1px solid var(--border)" : "none",
                  background: idx % 2 === 0 ? "#ffffff" : "#fcfcfd"
                }}
              >
                <div>
                  <h4 style={{ fontSize: "1rem", fontWeight: 700 }}>{item.name}</h4>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    ₹{item.price?.toLocaleString("en-IN")} × {item.quantity}
                  </span>
                </div>
                <strong style={{ fontSize: "1.05rem", color: "var(--text-main)" }}>
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </strong>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Identifiers */}
        <div
          style={{
            background: "#f8fafc",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            padding: "1.25rem",
            marginBottom: "2rem"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ color: "var(--text-muted)" }}>Razorpay Order ID:</span>
            <code style={{ fontSize: "0.85rem" }}>{order.razorpayOrderId || "N/A"}</code>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ color: "var(--text-muted)" }}>Razorpay Payment ID:</span>
            <code style={{ fontSize: "0.85rem" }}>{order.razorpayPaymentId || "N/A"}</code>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderTop: "1px solid var(--border)",
              paddingTop: "0.75rem",
              fontSize: "1.25rem",
              fontWeight: 800
            }}
          >
            <span>Total Amount Paid:</span>
            <span style={{ color: "var(--primary)" }}>₹{order.totalAmount?.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Bonus: Status Progression Demo */}
        <div
          style={{
            borderTop: "1px dashed var(--border)",
            paddingTop: "1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem"
          }}
        >
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            ⚡ Bonus: Order Status Progression Simulator
          </span>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"].map((st) => (
              <button
                key={st}
                onClick={() => handleStatusChange(st)}
                disabled={updatingStatus || order.status === st}
                className="btn-outline"
                style={{
                  fontSize: "0.75rem",
                  padding: "0.25rem 0.6rem",
                  borderColor: order.status === st ? "var(--primary)" : "var(--border)",
                  background: order.status === st ? "var(--primary-light)" : "transparent"
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
