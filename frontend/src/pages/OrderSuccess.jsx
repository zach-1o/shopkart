import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById } from "../services/api.js";

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await getOrderById(id);
      if (res.success && res.order) {
        setOrder(res.order);
      }
    } catch (err) {
      console.warn("Could not fetch order confirmation:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="state-container" style={{ borderStyle: "solid", borderColor: "var(--primary-border)" }}>
        <div style={{ fontSize: "4rem", marginBottom: "0.5rem" }}>✅</div>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "0.5rem" }}>
          Order Placed Successfully!
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", marginBottom: "1.75rem" }}>
          Your order has been saved successfully and is now being processed.
        </p>

        {order && (
          <div
            style={{
              background: "#f8fafc",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "1.5rem",
              width: "100%",
              maxWidth: "460px",
              textAlign: "left",
              marginBottom: "2rem"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <span style={{ color: "var(--text-muted)" }}>Order ID:</span>
              <strong style={{ fontFamily: "monospace" }}>#{order._id}</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <span style={{ color: "var(--text-muted)" }}>Total Paid:</span>
              <strong style={{ color: "var(--primary)", fontSize: "1.1rem" }}>
                ₹{order.totalAmount?.toLocaleString("en-IN")}
              </strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <span style={{ color: "var(--text-muted)" }}>Payment Status:</span>
              <span className="badge badge-paid">{order.paymentStatus}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Order Status:</span>
              <span className="badge badge-placed">{order.status}</span>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
          <Link to="/orders" className="btn-primary" style={{ padding: "0.75rem 1.5rem" }}>
            View My Orders
          </Link>
          <Link to="/products" className="btn-secondary" style={{ padding: "0.75rem 1.5rem" }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
