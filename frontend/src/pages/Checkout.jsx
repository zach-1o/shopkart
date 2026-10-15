import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { createPaymentOrder, verifyPayment } from "../services/api.js";
import CheckoutForm from "../components/CheckoutForm.jsx";
import OrderSummary from "../components/OrderSummary.jsx";

const Checkout = () => {
  const { cartItems, subtotal, clearCartState } = useCart();
  const { customer, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: customer?.fullName || "",
    phone: customer?.phone || "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [showSimulatedModal, setShowSimulatedModal] = useState(null);

  useEffect(() => {
    if (!authLoading && !customer) {
      navigate("/login");
    }
  }, [customer, authLoading, navigate]);

  useEffect(() => {
    if (customer) {
      setShippingAddress((prev) => ({
        ...prev,
        fullName: prev.fullName || customer.fullName || "",
        phone: prev.phone || customer.phone || ""
      }));
    }
  }, [customer]);

  if (cartItems.length === 0 && !showSimulatedModal) {
    return (
      <div className="main-content">
        <div className="state-container">
          <div className="state-icon">🛒</div>
          <h2 className="state-title">Your cart is empty</h2>
          <p className="state-subtitle">Add items to your cart before proceeding to checkout.</p>
          <Link to="/products" className="btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const validate = () => {
    const errs = {};
    if (!shippingAddress.fullName.trim()) errs.fullName = "Full name is required";
    if (!shippingAddress.phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(shippingAddress.phone.trim())) {
      errs.phone = "Phone must be a valid 10-digit number";
    }
    if (!shippingAddress.addressLine1.trim()) errs.addressLine1 = "Address line is required";
    if (!shippingAddress.city.trim()) errs.city = "City is required";
    if (!shippingAddress.state.trim()) errs.state = "State is required";
    if (!shippingAddress.pincode.trim()) {
      errs.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(shippingAddress.pincode.trim())) {
      errs.pincode = "Pincode must contain 6 digits";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setPaymentError("");

    if (!validate()) return;

    try {
      setSubmitting(true);
      // 1. Create Pending Order & Razorpay Order on server
      const data = await createPaymentOrder(shippingAddress);

      // Check if real Razorpay SDK is available and key is a live/registered test key
      const isPlaceholderKey = !data.key || data.key.includes("placeholder");

      if (window.Razorpay && !isPlaceholderKey) {
        // Standard Razorpay Checkout
        const options = {
          key: data.key,
          amount: data.amount,
          currency: data.currency,
          name: "ShopKart",
          description: "Purchase at ShopKart",
          order_id: data.razorpayOrderId,
          handler: async function (response) {
            try {
              // 2. Verify signature on backend
              const verifyRes = await verifyPayment({
                shopKartOrderId: data.shopKartOrderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });

              if (verifyRes.success) {
                clearCartState();
                navigate(`/order-success/${data.shopKartOrderId}`);
              }
            } catch (vErr) {
              setPaymentError("Payment signature verification failed. Cart has not been cleared.");
            }
          },
          prefill: {
            name: shippingAddress.fullName,
            contact: shippingAddress.phone,
            email: customer?.email
          },
          theme: {
            color: "#4f46e5"
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (resp) {
          setPaymentError("Payment failed or was cancelled. Your cart has been preserved.");
        });
        rzp.open();
      } else {
        // Test mode / Fallback simulated Razorpay gateway for seamless testing
        setShowSimulatedModal(data);
      }
    } catch (err) {
      console.error("Order creation error:", err);
      setPaymentError(err.response?.data?.message || "Failed to create order. Please check stock.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSimulatedPayment = async (success) => {
    if (!showSimulatedModal) return;
    const data = showSimulatedModal;

    if (!success) {
      setShowSimulatedModal(null);
      setPaymentError("Payment was cancelled or failed. Your cart has not been cleared.");
      return;
    }

    try {
      setSubmitting(true);
      const fakePaymentId = `pay_test_${Date.now()}`;
      const verifyRes = await verifyPayment({
        shopKartOrderId: data.shopKartOrderId,
        razorpay_order_id: data.razorpayOrderId,
        razorpay_payment_id: fakePaymentId,
        razorpay_signature: "mock_signature"
      });

      if (verifyRes.success) {
        clearCartState();
        setShowSimulatedModal(null);
        navigate(`/order-success/${data.shopKartOrderId}`);
      }
    } catch (err) {
      setPaymentError("Signature verification failed.");
      setShowSimulatedModal(null);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="main-content">
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-main)" }}>
          Checkout 💳
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Confirm your delivery address and complete payment
        </p>
      </div>

      {paymentError && <div className="alert alert-danger">{paymentError}</div>}

      <div className="cart-layout">
        {/* Shipping Form - Lab 06 Task 2 */}
        <div>
          <CheckoutForm
            shippingAddress={shippingAddress}
            setShippingAddress={setShippingAddress}
            errors={errors}
          />
        </div>

        {/* Final Cart Summary - Lab 06 Task 2 */}
        <div>
          <OrderSummary
            items={cartItems}
            subtotal={subtotal}
            title="Final Review"
            actionButton={
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={submitting}
                className="btn-primary"
                style={{ width: "100%", padding: "0.9rem", fontSize: "1.05rem" }}
              >
                {submitting ? "Processing Payment..." : `Pay ₹${subtotal.toLocaleString("en-IN")}`}
              </button>
            }
          />
        </div>
      </div>

      {/* Simulated Razorpay Test Mode Modal when placeholder keys are used */}
      {showSimulatedModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "var(--radius-lg)",
              padding: "2rem",
              maxWidth: "420px",
              width: "90%",
              boxShadow: "var(--shadow-xl)",
              textAlign: "center"
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>💳</div>
            <h3 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: "0.5rem" }}>
              Razorpay Checkout (Test Mode)
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.25rem" }}>
              Amount to Pay: <strong>₹{(showSimulatedModal.amount / 100).toLocaleString("en-IN")}</strong>
              <br />
              Razorpay Order ID: <code style={{ fontSize: "0.8rem" }}>{showSimulatedModal.razorpayOrderId}</code>
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <button
                onClick={() => handleSimulatedPayment(true)}
                disabled={submitting}
                className="btn-primary"
                style={{ width: "100%", padding: "0.8rem" }}
              >
                ✓ Complete Test Payment (Success)
              </button>
              <button
                onClick={() => handleSimulatedPayment(false)}
                disabled={submitting}
                className="btn-secondary"
                style={{ width: "100%", padding: "0.8rem" }}
              >
                ✕ Cancel Payment (Simulate Failure)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
