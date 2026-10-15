import React from "react";

const OrderSummary = ({ items, subtotal, actionButton, title = "Order Summary" }) => {
  const totalUnits = items.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <div className="summary-card">
      <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "1.25rem", color: "var(--text-main)" }}>
        {title}
      </h3>

      <div className="summary-row">
        <span>Total Items:</span>
        <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{totalUnits}</span>
      </div>

      <div className="summary-row">
        <span>Subtotal:</span>
        <span style={{ fontWeight: 600, color: "var(--text-main)" }}>₹{subtotal.toLocaleString("en-IN")}</span>
      </div>

      <div className="summary-row">
        <span>Estimated Delivery:</span>
        <span style={{ fontWeight: 600, color: "var(--success)" }}>FREE</span>
      </div>

      <div className="summary-total">
        <span>Total Amount:</span>
        <span style={{ color: "var(--primary)" }}>₹{subtotal.toLocaleString("en-IN")}</span>
      </div>

      {actionButton && <div style={{ marginTop: "1.5rem" }}>{actionButton}</div>}
    </div>
  );
};

export default OrderSummary;
