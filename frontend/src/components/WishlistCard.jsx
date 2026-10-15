import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

const WishlistCard = ({ product, onRemove }) => {
  const { addToCart } = useCart();
  const [moving, setMoving] = React.useState(false);

  const handleMoveToCart = async () => {
    setMoving(true);
    await addToCart(product._id);
    setMoving(false);
  };

  return (
    <div className="product-card">
      <div className="product-card-image-wrap">
        <img src={product.image} alt={product.name} className="product-card-image" />
      </div>

      <div className="product-card-body">
        <span className="product-category-badge">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>

        <div className="product-price-row">
          <span className="product-price">₹{product.price.toLocaleString("en-IN")}</span>
          <span
            className={`stock-status ${
              product.stock > 5 ? "in-stock" : product.stock > 0 ? "low-stock" : "out-of-stock"
            }`}
          >
            {product.stock > 0 ? `${product.stock} units left` : "Out of stock"}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            <Link to={`/products/${product._id}`} className="btn-outline" style={{ textAlign: "center" }}>
              View Details
            </Link>
            <button
              onClick={handleMoveToCart}
              disabled={moving || product.stock <= 0}
              className="btn-primary"
              style={{ fontSize: "0.85rem", padding: "0.5rem" }}
            >
              {moving ? "Adding..." : "Add to Cart"}
            </button>
          </div>

          <button
            onClick={() => onRemove(product._id)}
            className="btn-danger"
            style={{ width: "100%", fontSize: "0.85rem", padding: "0.45rem" }}
          >
            Remove from Wishlist ♥
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistCard;
