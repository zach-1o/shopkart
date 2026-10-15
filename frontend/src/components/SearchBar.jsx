import React from "react";

const SearchBar = ({ search, setSearch, category, setCategory, sort, setSort, onSearchSubmit }) => {
  const categories = ["All Categories", "Electronics", "Fashion", "Home", "Books"];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) onSearchSubmit();
  };

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "1.25rem",
        marginBottom: "2rem",
        boxShadow: "var(--shadow-sm)"
      }}
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
        {/* Search Input */}
        <div style={{ flex: "2 1 240px", position: "relative" }}>
          <input
            type="text"
            placeholder="Search products by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: "1rem" }}
          />
        </div>

        {/* Category Dropdown */}
        <div style={{ flex: "1 1 180px" }}>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div style={{ flex: "1 1 180px" }}>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">Default Sorting</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
