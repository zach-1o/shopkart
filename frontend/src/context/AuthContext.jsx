import React, { createContext, useContext, useState, useEffect } from "react";
import { getMyProfile, loginCustomer, logoutCustomer, registerCustomer } from "../services/api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authenticated session on initial mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const data = await getMyProfile();
      setCustomer(data);
    } catch (err) {
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await loginCustomer({ email, password });
    if (res.token) {
      localStorage.setItem("shopkart_token", res.token);
    }
    if (res.success && res.customer) {
      setCustomer(res.customer);
    } else {
      // Profile fallback
      await checkAuth();
    }
    return res;
  };

  const register = async (formData) => {
    const res = await registerCustomer(formData);
    if (res.token) {
      localStorage.setItem("shopkart_token", res.token);
    }
    return res;
  };

  const logout = async () => {
    try {
      await logoutCustomer();
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      localStorage.removeItem("shopkart_token");
      setCustomer(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        loading,
        login,
        register,
        logout,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
