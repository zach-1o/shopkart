import React, { useState, useEffect } from "react";
import { getProducts, getWishlist } from "../services/api.js";
import ProductCard from "../components/ProductCard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Products = () => {
  const { customer } = useAuth();
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [sort, setSort] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [search, category, sort]);

  useEffect(() => {
    if (customer) {
      loadWishlistIds();
    }
  }, [customer]);

  const loadWishlistIds = async () => {
    try {
      const res = await getWishlist();
      if (res.success && Array.isArray(res.wishlist)) {
        const ids = new Set(res.wishlist.map((item) => (item._id ? item._id : item)));
        setWishlistIds(ids);
      }
    } catch (err) {
      // Non-blocking
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (category && category !== "All Categories") params.category = category;
      if (sort) params.sort = sort;

      const res = await getProducts(params);
      if (res.success && Array.isArray(res.products)) {
        setProducts(res.products);
      }
    } catch (err) {
      console.error("Products load error:", err);
      setError("Something went wrong while loading products.");
    } finally {
      setLoading(false);
    }
  };

  const handleWishlistChange = (productId, isAdded) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (isAdded) next.add(productId);
      else next.delete(productId);
      return next;
    });
  };

  return (
    <div className="main-content">
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-main)" }}>
          Product Catalog
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Browse our high quality selection of tech, gadgets, books, and lifestyle items.
        </p>
      </div>

      {/* Search and Category Filter UI - Lab 03 Task 7 */}
      <SearchBar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        sort={sort}
        setSort={setSort}
        onSearchSubmit={fetchProducts}
      />

      {/* Loading State - Lab 03 */}
      {loading && (
        <div className="state-container">
          <div className="spinner"></div>
          <p className="state-title">Loading products...</p>
        </div>
      )}

      {/* Error State - Lab 03 */}
      {!loading && error && (
        <div className="state-container">
          <div className="state-icon">⚠️</div>
          <h3 className="state-title">{error}</h3>
          <p className="state-subtitle">Please check your backend connection and try again.</p>
          <button onClick={fetchProducts} className="btn-primary">
            Try Again
          </button>
        </div>
      )}

      {/* Empty State - Lab 03 */}
      {!loading && !error && products.length === 0 && (
        <div className="state-container">
          <div className="state-icon">🔍</div>
          <h3 className="state-title">No products found.</h3>
          <p className="state-subtitle">We couldn't find any items matching your search criteria.</p>
          <button
            onClick={() => {
              setSearch("");
              setCategory("All Categories");
              setSort("");
            }}
            className="btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Dynamic Products Grid - Lab 03 Task 6 */}
      {!loading && !error && products.length > 0 && (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              isWishlisted={wishlistIds.has(product._id)}
              onWishlistChange={handleWishlistChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
