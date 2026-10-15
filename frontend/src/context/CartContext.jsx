import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { getCart, addToCart as apiAddToCart, updateCartQuantity as apiUpdateQuantity, removeFromCart as apiRemoveFromCart } from "../services/api.js";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { customer } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState(null);

  // Fetch cart whenever customer logs in; clear when logged out
  useEffect(() => {
    if (customer) {
      refreshCart();
    } else {
      setCartItems([]);
      setCartError(null);
    }
  }, [customer]);

  const refreshCart = async () => {
    try {
      setCartLoading(true);
      setCartError(null);
      const res = await getCart();
      if (res.success && Array.isArray(res.cart)) {
        setCartItems(res.cart);
      }
    } catch (err) {
      console.warn("Error refreshing cart:", err);
      setCartError(err.response?.data?.message || "Failed to load cart");
    } finally {
      setCartLoading(false);
    }
  };

  const addToCart = async (productId) => {
    try {
      setCartError(null);
      const res = await apiAddToCart(productId);
      if (res.success && res.cart) {
        setCartItems(res.cart);
      } else {
        await refreshCart();
      }
      return { success: true, message: res.message || "Added to cart" };
    } catch (err) {
      const msg = err.response?.data?.message || "Unable to add to cart";
      setCartError(msg);
      return { success: false, message: msg };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      setCartError(null);
      const res = await apiUpdateQuantity(productId, quantity);
      if (res.success && res.cart) {
        setCartItems(res.cart);
      } else {
        await refreshCart();
      }
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Unable to update quantity";
      setCartError(msg);
      return { success: false, message: msg };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setCartError(null);
      const res = await apiRemoveFromCart(productId);
      if (res.success && res.cart) {
        setCartItems(res.cart);
      } else {
        await refreshCart();
      }
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Unable to remove item from cart";
      setCartError(msg);
      return { success: false, message: msg };
    }
  };

  // Called when payment verification succeeds to clear client cart state immediately
  const clearCartState = () => {
    setCartItems([]);
  };

  // Derived state: total count of units across all products in cart
  const cartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  }, [cartItems]);

  // Derived state: subtotal = Σ (price * quantity)
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const price = item.product?.price || 0;
      const qty = item.quantity || 1;
      return acc + price * qty;
    }, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartLoading,
        cartError,
        cartCount,
        subtotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        refreshCart,
        clearCartState
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
