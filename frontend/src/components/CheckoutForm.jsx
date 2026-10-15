import React from "react";

const CheckoutForm = ({ shippingAddress, setShippingAddress, errors }) => {
  const handleChange = (field, value) => {
    setShippingAddress((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "1.75rem",
        boxShadow: "var(--shadow-sm)"
      }}
    >
      <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.25rem", color: "var(--text-main)" }}>
        📦 Shipping Address
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {/* Full Name */}
        <div className="form-group" style={{ gridColumn: "span 2" }}>
          <label className="form-label">Full Name *</label>
          <input
            type="text"
            placeholder="e.g. Aarav Sharma"
            value={shippingAddress.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
          />
          {errors.fullName && <p className="form-error">{errors.fullName}</p>}
        </div>

        {/* Phone Number */}
        <div className="form-group" style={{ gridColumn: "span 2" }}>
          <label className="form-label">Phone Number *</label>
          <input
            type="tel"
            placeholder="10-digit mobile number"
            value={shippingAddress.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            maxLength={10}
          />
          {errors.phone && <p className="form-error">{errors.phone}</p>}
        </div>

        {/* Address Line 1 */}
        <div className="form-group" style={{ gridColumn: "span 2" }}>
          <label className="form-label">Address Line *</label>
          <input
            type="text"
            placeholder="Flat / House No., Street, Area"
            value={shippingAddress.addressLine1}
            onChange={(e) => handleChange("addressLine1", e.target.value)}
          />
          {errors.addressLine1 && <p className="form-error">{errors.addressLine1}</p>}
        </div>

        {/* City */}
        <div className="form-group">
          <label className="form-label">City *</label>
          <input
            type="text"
            placeholder="e.g. Bengaluru"
            value={shippingAddress.city}
            onChange={(e) => handleChange("city", e.target.value)}
          />
          {errors.city && <p className="form-error">{errors.city}</p>}
        </div>

        {/* State */}
        <div className="form-group">
          <label className="form-label">State *</label>
          <input
            type="text"
            placeholder="e.g. Karnataka"
            value={shippingAddress.state}
            onChange={(e) => handleChange("state", e.target.value)}
          />
          {errors.state && <p className="form-error">{errors.state}</p>}
        </div>

        {/* Pincode */}
        <div className="form-group" style={{ gridColumn: "span 2" }}>
          <label className="form-label">Pincode (6 digits) *</label>
          <input
            type="text"
            placeholder="e.g. 560001"
            value={shippingAddress.pincode}
            onChange={(e) => handleChange("pincode", e.target.value)}
            maxLength={6}
          />
          {errors.pincode && <p className="form-error">{errors.pincode}</p>}
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
