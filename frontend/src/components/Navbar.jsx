import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const Navbar = () => {
  const { customer, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to={customer ? "/home" : "/login"} className="brand-logo">
          <div className="brand-icon">🛒</div>
          <span>ShopKart</span>
        </Link>

        <nav className="nav-links">
          {customer ? (
            <>
              <NavLink to="/home" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Home
              </NavLink>
              <NavLink to="/products" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Products
              </NavLink>
              <NavLink to="/wishlist" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Wishlist
              </NavLink>
              <NavLink to="/cart" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Cart {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
              </NavLink>
              <NavLink to="/orders" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                My Orders
              </NavLink>
              <button onClick={handleLogout} className="btn-secondary" style={{ padding: "0.4rem 0.9rem" }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Login
              </NavLink>
              <NavLink to="/register" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
