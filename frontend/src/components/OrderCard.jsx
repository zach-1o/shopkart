import React from "react";
import { Link } from "react-router-dom";

const OrderCard = ({ order }) => {
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "1.5rem",
        marginBottom: "1.25rem",
        boxShadow: "var(--shadow-sm)",
        transition: "var(--transition)"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          borderBottom: "1px solid var(--border)",
          paddingBottom: "1rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
          gap: "0.5rem"
        }}
      >
        <div>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Order ID</span>
          <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)" }}>
            #{order._id.substring(order._id.length - 8)}
          </h4>
          <span style={{ fontSize: "0.8rem", color: "var(--text-light)" }}>Placed on {formattedDate}</span>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <span
            className={`badge ${
              order.paymentStatus === "PAID" ? "badge-paid" : "badge-pending"
            }`}
          >
            Payment: {order.paymentStatus}
          </span>
          <span
            className={`badge ${
              order.status === "PLACED" || order.status === "CONFIRMED" || order.status === "DELIVERED"
                ? "badge-placed"
                : "badge-pending"
            }`}
          >
            Status: {order.status}
          </span>
        </div>
      </div>

      {/* Items Preview */}
      <div style={{ marginBottom: "1rem" }}>
        {order.items?.map((item, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.35rem 0",
              fontSize: "0.95rem"
            }}
          >
            <span style={{ color: "var(--text-main)", fontWeight: 500 }}>
              {item.name} <strong style={{ color: "var(--text-muted)" }}>× {item.quantity}</strong>
            </span>
            <span style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px dashed var(--border)",
          paddingTop: "0.9rem",
          flexWrap: "wrap",
          gap: "0.75rem"
        }}
      >
        <div>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Total Amount: </span>
          <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--primary)" }}>
            ₹{order.totalAmount?.toLocaleString("en-IN")}
          </span>
        </div>

        <Link to={`/orders/${order._id}`} className="btn-outline">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default OrderCard;
