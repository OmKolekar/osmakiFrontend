import React from "react";
import { Link } from "react-router-dom";
import useAddProduct from "../hooks/useAddProduct";
import VariantImageUploader from "../components/VariantImageUploader";
import "../styles/adminTabs.css";

export default function AddProduct() {
  const {
    categories,
    name,
    setName,
    subtitle,
    setSubtitle,
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
    isTrending,
    setIsTrending,
    isFeatured,
    setIsFeatured,
    isBestSeller,
    setIsBestSeller,
    variants,
    handleAddVariantRow,
    handleRemoveVariantRow,
    handleVariantChange,
    handleSubmit,
    errorMsg,
    successMsg,
    isSubmitting,
    discountCalc,
  } = useAddProduct();

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", paddingBottom: "80px" }}>
      {/* Page Header */}
      <div className="admin-header" style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 className="admin-header-title">Add New Product</h1>
          <p style={{ margin: "4px 0 0 0", color: "#71717a", fontSize: "14px" }}>
            Configure essential garment identity, commercial pricing, and inventory variants.
          </p>
        </div>
        <Link
          to="/admin/inventory"
          style={{
            padding: "8px 16px",
            background: "#ffffff",
            border: "1px solid #e4e4e7",
            borderRadius: "6px",
            fontSize: "13px",
            fontWeight: "600",
            color: "#18181b",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          ← Back to Inventory
        </Link>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div style={{ padding: "12px 18px", backgroundColor: "#fef2f2", color: "#dc2626", borderRadius: "8px", marginBottom: "20px", fontSize: "14px", fontWeight: "500", border: "1px solid #fecaca" }}>
          ⚠️ {errorMsg}
        </div>
      )}

      {successMsg && (
        <div style={{ padding: "12px 18px", backgroundColor: "#ecfdf5", color: "#047857", borderRadius: "8px", marginBottom: "20px", fontSize: "14px", fontWeight: "500", border: "1px solid #a7f3d0" }}>
          ✓ {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* =========================================================================
            CARD 1: CORE IDENTITY & DETAILS
           ========================================================================= */}
        <div className="admin-section-card" style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: "8px", padding: "24px" }}>
          <h3 className="admin-section-card-title" style={{ fontSize: "16px", fontWeight: "700", marginBottom: "4px" }}>
            1. Garment Core Identity
          </h3>
          <p className="admin-section-card-desc" style={{ color: "#71717a", fontSize: "13px", marginBottom: "20px" }}>
            Define the primary display title, subtitle tagline, and taxonomy.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="admin-form-group">
              <label className="admin-label">Product Name *</label>
              <input
                type="text"
                placeholder="e.g. OVERSIZED HEAVYWEIGHT T-SHIRT"
                required
                disabled={isSubmitting}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="admin-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Product Subtitle (Displayed Under Title)</label>
              <input
                type="text"
                placeholder="e.g. Washed Onyx Black • Dropped Shoulder Silhouette • Pre-Shrunk Luxury Fit"
                disabled={isSubmitting}
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="admin-input"
              />
            </div>

            <div className="admin-grid-3">
              <div className="admin-form-group">
                <label className="admin-label">Category *</label>
                <select
                  disabled={isSubmitting}
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="admin-select"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Gender Allocation</label>
                <select
                  disabled={isSubmitting}
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="admin-select"
                >
                  <option value="Unisex">Unisex</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Brand</label>
                <input
                  type="text"
                  placeholder="e.g. OSMAKI"
                  disabled={isSubmitting}
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="admin-input"
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Description & Material Notes</label>
              <textarea
                placeholder="Describe fabric composition, fit characteristics, collar tension, and care details..."
                rows="4"
                disabled={isSubmitting}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="admin-textarea"
              />
            </div>
          </div>
        </div>

        {/* =========================================================================
            CARD 2: COMMERCIAL PRICING & DISCOVER FLAGS
           ========================================================================= */}
        <div className="admin-section-card" style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: "8px", padding: "24px" }}>
          <h3 className="admin-section-card-title" style={{ fontSize: "16px", fontWeight: "700", marginBottom: "4px" }}>
            2. Commercial Pricing & Flags
          </h3>
          <p className="admin-section-card-desc" style={{ color: "#71717a", fontSize: "13px", marginBottom: "20px" }}>
            Set original MRP strike price, promotional selling price, and storefront highlight tags.
          </p>

          <div className="admin-grid-2" style={{ marginBottom: "20px" }}>
            <div className="admin-form-group">
              <label className="admin-label">Base / Original MRP (₹) *</label>
              <input
                type="number"
                step="0.01"
                placeholder="1299.00"
                required
                disabled={isSubmitting}
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="admin-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">
                Discount / Sale Price (₹){" "}
                {discountCalc !== null && (
                  <span style={{ color: "#16a34a", fontWeight: "700", marginLeft: "6px" }}>
                    ({discountCalc}% OFF)
                  </span>
                )}
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="999.00"
                disabled={isSubmitting}
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                className="admin-input"
              />
            </div>
          </div>

          <div>
            <label className="admin-label">Promotional Badges</label>
            <div className="discovery-badges-row" style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <label className={`discovery-badge-pill ${isBestSeller ? "active" : ""}`}>
                <input
                  type="checkbox"
                  disabled={isSubmitting}
                  checked={isBestSeller}
                  onChange={(e) => setIsBestSeller(e.target.checked)}
                />
                <span className="pill-indicator">{isBestSeller ? "✓" : "+"}</span>
                <span>Best Seller</span>
              </label>

              <label className={`discovery-badge-pill ${isTrending ? "active" : ""}`}>
                <input
                  type="checkbox"
                  disabled={isSubmitting}
                  checked={isTrending}
                  onChange={(e) => setIsTrending(e.target.checked)}
                />
                <span className="pill-indicator">{isTrending ? "✓" : "+"}</span>
                <span>Trending Drop</span>
              </label>

              <label className={`discovery-badge-pill ${isFeatured ? "active" : ""}`}>
                <input
                  type="checkbox"
                  disabled={isSubmitting}
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                />
                <span className="pill-indicator">{isFeatured ? "✓" : "+"}</span>
                <span>Featured on Home</span>
              </label>
            </div>
          </div>
        </div>

        {/* =========================================================================
            CARD 3: INVENTORY VARIANTS & IMAGERY
           ========================================================================= */}
        <div className="admin-section-card" style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: "8px", padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div>
              <h3 className="admin-section-card-title" style={{ fontSize: "16px", fontWeight: "700", marginBottom: "4px" }}>
                3. Inventory Variants & Garment Photos
              </h3>
              <p className="admin-section-card-desc" style={{ color: "#71717a", fontSize: "13px", marginBottom: 0 }}>
                Configure colorways, sizes, SKU codes, available stock, and showcase imagery.
              </p>
            </div>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleAddVariantRow}
              style={{
                background: "#18181b",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                padding: "8px 16px",
                fontSize: "12px",
                fontWeight: "700",
                cursor: "pointer",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              + Add Variant
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {variants.map((v, idx) => (
              <div
                key={v.id}
                style={{
                  background: "#fafafa",
                  border: "1px solid #e4e4e7",
                  borderRadius: "8px",
                  padding: "18px",
                  position: "relative",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: "1px solid #e4e4e7", paddingBottom: "10px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.6px", color: "#18181b" }}>
                    Variant 0{idx + 1} {v.color && `— ${v.color}`} {v.size && `(${v.size})`}
                  </span>
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveVariantRow(v.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#ef4444",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      ✕ Remove Variant
                    </button>
                  )}
                </div>

                <div className="admin-grid-4" style={{ marginBottom: "16px" }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Color *</label>
                    <input
                      type="text"
                      placeholder="e.g. Onyx Black"
                      required
                      value={v.color}
                      onChange={(e) => handleVariantChange(v.id, "color", e.target.value)}
                      className="admin-input"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Size *</label>
                    <div style={{ display: "flex", gap: "4px", marginBottom: "6px", flexWrap: "wrap" }}>
                      {["XS", "S", "M", "L", "XL", "XXL", "3XL"].map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => handleVariantChange(v.id, "size", sz)}
                          style={{
                            padding: "3px 8px",
                            fontSize: "11px",
                            fontWeight: "750",
                            background: v.size === sz ? "#18181b" : "#ffffff",
                            color: v.size === sz ? "#ffffff" : "#3f3f46",
                            border: `1px solid ${v.size === sz ? "#18181b" : "#d4d4d8"}`,
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. S, M, L, XL"
                      required
                      value={v.size}
                      onChange={(e) => handleVariantChange(v.id, "size", e.target.value)}
                      className="admin-input"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">SKU *</label>
                    <input
                      type="text"
                      placeholder="e.g. OSM-240G-OVT-BLK-M"
                      required
                      value={v.sku}
                      onChange={(e) => handleVariantChange(v.id, "sku", e.target.value)}
                      className="admin-input"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Stock Units *</label>
                    <input
                      type="number"
                      placeholder="50"
                      min="0"
                      required
                      value={v.stock}
                      onChange={(e) => handleVariantChange(v.id, "stock", e.target.value)}
                      className="admin-input"
                    />
                  </div>
                </div>

                {/* Imagery Uploader for this variant */}
                <VariantImageUploader
                  files={v.files || []}
                  imageUrls={v.imageUrls || []}
                  onFilesChange={(newFiles) => handleVariantChange(v.id, "files", newFiles)}
                  onUrlsChange={(newUrls) => handleVariantChange(v.id, "imageUrls", newUrls)}
                  variantLabel={`Variant 0${idx + 1}`}
                  disabled={isSubmitting}
                />
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            BOTTOM ACTIONS
           ========================================================================= */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
          <Link
            to="/admin/inventory"
            style={{
              padding: "12px 24px",
              background: "#ffffff",
              border: "1px solid #e4e4e7",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "600",
              color: "#52525b",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: "12px 32px",
              background: "#18181b",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "700",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting ? 0.7 : 1,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            {isSubmitting ? "Publishing Product..." : "Publish Product →"}
          </button>
        </div>
      </form>
    </div>
  );
}
