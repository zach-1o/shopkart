import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const [updating, setUpdating] = React.useState(false);

  const product = item.product;
  if (!product) return null;

  const handleDecrease = async () => {
    if (item.quantity <= 1 || updating) return;
    setUpdating(true);
    await updateQuantity(product._id, item.quantity - 1);
    setUpdating(false);
  };

  const handleIncrease = async () => {
    if (item.quantity >= product.stock || updating) return;
    setUpdating(true);
    await updateQuantity(product._id, item.quantity + 1);
    setUpdating(false);
  };

  const handleRemove = async () => {
    if (updating) return;
    setUpdating(true);
    await removeFromCart(product._id);
    setUpdating(false);
  };

  const itemTotal = (product.price || 0) * (item.quantity || 1);

  return (
    <div className="cart-item">
      <Link to={`/products/${product._id}`}>
        <img src={product.image} alt={product.name} className="cart-item-img" />
      </Link>

      <div className="cart-item-info">
        <Link to={`/products/${product._id}`}>
          <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.25rem" }}>{product.name}</h4>
        </Link>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "0.75rem" }}>
          Unit Price: ₹{product.price?.toLocaleString("en-IN")}
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
          {/* [-] Qty [+] Controls */}
          <div className="quantity-control">
            <button
              onClick={handleDecrease}
              disabled={item.quantity <= 1 || updating}
              className="qty-btn"
              title="Decrease quantity"
            >
              -
            </button>
            <span className="qty-value">{item.quantity}</span>
            <button
              onClick={handleIncrease}
              disabled={item.quantity >= product.stock || updating}
              className="qty-btn"
              title="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            onClick={handleRemove}
            disabled={updating}
            className="btn-danger"
            style={{ padding: "0.25rem 0.6rem", fontSize: "0.8rem" }}
          >
            Remove
          </button>

          {item.quantity >= product.stock && (
            <span style={{ fontSize: "0.8rem", color: "var(--warning)", fontWeight: 600 }}>
              Max stock reached ({product.stock})
            </span>
          )}
        </div>
      </div>

      <div style={{ textAlign: "right", minWidth: "100px" }}>
        <span style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-main)" }}>
          ₹{itemTotal.toLocaleString("en-IN")}
        </span>
      </div>
    </div>
  );
};

export default CartItem;
