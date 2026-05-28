import React from "react";
import useAddProduct from "../hooks/useAddProduct";

export default function AddProduct() {
  const {
    categories,
    name,
    setName,
    description,
    setDescription,
    basePrice,
    setBasePrice,
    discountPrice,
    setDiscountPrice,
    categoryId,
    setCategoryId,
    gender,
    setGender,
    brand,
    setBrand,
    variants,
    errorMsg,
    successMsg,
    isSubmitting,
    isTrending,
    setIsTrending,
    isFeatured,
    setIsFeatured,
    isBestSeller,
    setIsBestSeller,
    handleAddVariantRow,
    handleRemoveVariantRow,
    handleVariantChange,
    handleSubmit,
  } = useAddProduct();

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <div className="admin-header">
        <h1 className="admin-header-title">Add New Product</h1>
      </div>

      {errorMsg && (
        <div style={{ padding: "12px 18px", backgroundColor: "#fef2f2", color: "#dc2626", borderRadius: "8px", marginBottom: "20px", fontSize: "14px", fontWeight: "500" }}>
          ⚠️ {errorMsg}
        </div>
      )}

      {successMsg && (
        <div style={{ padding: "12px 18px", backgroundColor: "#ecfdf5", color: "#047857", borderRadius: "8px", marginBottom: "20px", fontSize: "14px", fontWeight: "500" }}>
          ✓ {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-card" style={{ padding: "30px" }}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input
              type="text"
              placeholder="e.g. Damascus Rose Facial Cleanser"
              required
              disabled={isSubmitting}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              placeholder="Enter product description and botanical details..."
              rows="3"
              disabled={isSubmitting}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-input"
              style={{ fontFamily: "Inter, sans-serif", resize: "vertical" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "20px" }}>
            <div className="form-group">
              <label className="form-label">Base Price (INR) *</label>
              <input
                type="number"
                placeholder="₹ Price"
                required
                disabled={isSubmitting}
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Discount Price (INR)</label>
              <input
                type="number"
                placeholder="₹ Discount Price"
                disabled={isSubmitting}
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                value={categoryId}
                disabled={isSubmitting}
                onChange={(e) => setCategoryId(e.target.value)}
                className="form-input"
                style={{ height: "46px" }}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Brand</label>
              <input
                type="text"
                placeholder="e.g. Osmaki, Dior"
                disabled={isSubmitting}
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Target Gender</label>
            <select
              value={gender}
              disabled={isSubmitting}
              onChange={(e) => setGender(e.target.value)}
              className="form-input"
              style={{ height: "46px" }}
            >
              <option value="Unisex">Unisex</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
            </select>
          </div>

          <div className="form-group" style={{ gridColumn: "span 3" }}>
            <label className="form-label">Promotional & Catalog Tags</label>
            <div style={{ display: "flex", gap: "24px", marginTop: "12px", alignItems: "center" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "500", userSelect: "none" }}>
                <input
                  type="checkbox"
                  disabled={isSubmitting}
                  checked={isBestSeller}
                  onChange={(e) => setIsBestSeller(e.target.checked)}
                  style={{ width: "18px", height: "18px", accentColor: "#111", cursor: "pointer" }}
                />
                Best Seller
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "500", userSelect: "none" }}>
                <input
                  type="checkbox"
                  disabled={isSubmitting}
                  checked={isTrending}
                  onChange={(e) => setIsTrending(e.target.checked)}
                  style={{ width: "18px", height: "18px", accentColor: "#111", cursor: "pointer" }}
                />
                Trending
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "500", userSelect: "none" }}>
                <input
                  type="checkbox"
                  disabled={isSubmitting}
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  style={{ width: "18px", height: "18px", accentColor: "#111", cursor: "pointer" }}
                />
                Featured
              </label>
            </div>
          </div>

          {/* Variants section */}
          <div className="variant-builder-section">
            <div className="variant-builder-header">
              <h3 style={{ margin: 0, fontFamily: "Inter", fontSize: "14px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Product Variants
              </h3>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleAddVariantRow}
                className="btn-add-variant"
              >
                + Add Variant Row
              </button>
            </div>

            {/* Column Label Headers */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 0.8fr 0.8fr 1fr 1fr 1fr 1.8fr 40px",
              gap: "12px",
              padding: "0 16px 8px 16px",
              fontSize: "11px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              color: "#666",
              textAlign: "left"
            }}>
              <div>SKU *</div>
              <div>Size</div>
              <div>Color</div>
              <div>Price override</div>
              <div>Discount override</div>
              <div>Initial Stock</div>
              <div>Image Upload</div>
              <div></div>
            </div>

            {variants.map((v, index) => (
              <div key={v.id} className="variant-builder-row">
                <input
                  type="text"
                  placeholder="e.g. SKU-100"
                  required
                  disabled={isSubmitting}
                  value={v.sku}
                  onChange={(e) => handleVariantChange(v.id, "sku", e.target.value)}
                  className="form-input"
                  style={{ padding: "8px 12px", fontSize: "13px" }}
                />
                <input
                  type="text"
                  placeholder="e.g. 100ml"
                  disabled={isSubmitting}
                  value={v.size}
                  onChange={(e) => handleVariantChange(v.id, "size", e.target.value)}
                  className="form-input"
                  style={{ padding: "8px 12px", fontSize: "13px" }}
                />
                <input
                  type="text"
                  placeholder="e.g. Amber"
                  disabled={isSubmitting}
                  value={v.color}
                  onChange={(e) => handleVariantChange(v.id, "color", e.target.value)}
                  className="form-input"
                  style={{ padding: "8px 12px", fontSize: "13px" }}
                />
                <input
                  type="number"
                  placeholder="Price"
                  disabled={isSubmitting}
                  value={v.price}
                  onChange={(e) => handleVariantChange(v.id, "price", e.target.value)}
                  className="form-input"
                  style={{ padding: "8px 12px", fontSize: "13px" }}
                />
                <input
                  type="number"
                  placeholder="Discount"
                  disabled={isSubmitting}
                  value={v.discountPrice || ""}
                  onChange={(e) => handleVariantChange(v.id, "discountPrice", e.target.value)}
                  className="form-input"
                  style={{ padding: "8px 12px", fontSize: "13px" }}
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Stock"
                  disabled={isSubmitting}
                  value={v.stock}
                  onChange={(e) => handleVariantChange(v.id, "stock", parseInt(e.target.value) || 0)}
                  className="form-input"
                  style={{ padding: "8px 12px", fontSize: "13px" }}
                />
                <label className="btn-file-upload" style={{ opacity: isSubmitting ? 0.6 : 1, cursor: isSubmitting ? "not-allowed" : "pointer" }}>
                  <input
                    type="file"
                    multiple
                    disabled={isSubmitting}
                    accept="image/*"
                    onChange={(e) => handleVariantChange(v.id, "files", Array.from(e.target.files))}
                    style={{ display: "none" }}
                  />
                  <span style={{ fontSize: "12px", color: v.files?.length > 0 ? "#047857" : "#666", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", padding: "0 8px" }}>
                    {v.files?.length > 0 
                      ? `Selected (${v.files.length})` 
                      : "Upload Images"
                    }
                  </span>
                </label>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleRemoveVariantRow(v.id)}
                  className="btn-delete-row"
                  title="Remove variant"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          <button type="submit" disabled={isSubmitting} className="form-submit-btn">
            {isSubmitting ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <span className="loader-spinner" style={{ width: "16px", height: "16px", borderWidth: "2px" }}></span>
                Processing Images & Uploading...
              </span>
            ) : (
              "Create Product Listing"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
