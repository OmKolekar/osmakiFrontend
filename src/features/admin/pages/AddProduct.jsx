import React from "react";
import useAddProduct from "../hooks/useAddProduct";
import VariantImageUploader from "../components/VariantImageUploader";
import "../styles/adminTabs.css";

export default function AddProduct() {
  const {
    activeTab,
    setActiveTab,
    categories,
    catalogProducts,
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
    variants,
    isTrending,
    setIsTrending,
    isFeatured,
    setIsFeatured,
    isBestSeller,
    setIsBestSeller,
    edition,
    setEdition,
    fabricGsm,
    setFabricGsm,
    badgeLabel,
    setBadgeLabel,
    batchLabel,
    setBatchLabel,
    modelSpec,
    setModelSpec,
    fitNote,
    setFitNote,
    techFeatures,
    macroTiles,
    accordions,
    sizeGuide,
    bundleIds,
    handleAddVariantRow,
    handleRemoveVariantRow,
    handleVariantChange,
    handleTechFeatureChange,
    handleMacroTileChange,
    handleSizeGuideChange,
    handleAccordionChange,
    handleToggleBundleId,
    handleSubmit,
    errorMsg,
    successMsg,
    isSubmitting,
  } = useAddProduct();

  // Instant discount percentage preview
  const parsedBase = parseFloat(basePrice) || 0;
  const parsedDiscount = parseFloat(discountPrice) || 0;
  const discountCalc =
    parsedBase > 0 && parsedDiscount > 0 && parsedDiscount < parsedBase
      ? Math.round(((parsedBase - parsedDiscount) / parsedBase) * 100)
      : null;

  return (
    <div style={{ maxWidth: "1050px", margin: "0 auto", paddingBottom: "60px" }}>
      {/* Header */}
      <div className="admin-header" style={{ marginBottom: "20px" }}>
        <div>
          <h1 className="admin-header-title">Add New Product</h1>
          <p style={{ margin: "4px 0 0 0", color: "#71717a", fontSize: "14px" }}>
            Configure architectural streetwear garments with live editorial specifications.
          </p>
        </div>
      </div>

      {/* Alerts */}
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

      <form onSubmit={handleSubmit} className="admin-tabs-container">
        {/* 1. SEGMENTED TAB STRIP */}
        <div className="admin-tab-strip">
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === "basics" ? "active" : ""}`}
            onClick={() => setActiveTab("basics")}
          >
            <span>🏷️ Basics & Pricing</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === "variants" ? "active" : ""}`}
            onClick={() => setActiveTab("variants")}
          >
            <span>📦 Variants & Stock</span>
            <span className="tab-badge-num">{variants.length}</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === "specs" ? "active" : ""}`}
            onClick={() => setActiveTab("specs")}
          >
            <span>📐 Specs & Fabric</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === "tiles" ? "active" : ""}`}
            onClick={() => setActiveTab("tiles")}
          >
            <span>📸 Detail Tiles & Bundles</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === "accordions" ? "active" : ""}`}
            onClick={() => setActiveTab("accordions")}
          >
            <span>📋 Accordions & Size Guide</span>
          </button>
        </div>

        {/* 2. TAB 1: BASICS & PRICING */}
        {activeTab === "basics" && (
          <div className="admin-tab-panel">
            <div className="admin-section-card">
              <h3 className="admin-section-card-title">Garment Core Identity</h3>
              <p className="admin-section-card-desc">Define the primary display title, subtitle, and categorization.</p>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div className="admin-form-group">
                  <label className="admin-label">Product Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. OVERSIZED TSHIRT"
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
                  <span className="admin-input-helper">Appears directly beneath the main title on the customer product details screen.</span>
                </div>

                <div className="admin-grid-3">
                  <div className="admin-form-group">
                    <label className="admin-label">Category *</label>
                    <select
                      value={categoryId}
                      disabled={isSubmitting}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="admin-select"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Gender Allocation</label>
                    <select
                      value={gender}
                      disabled={isSubmitting}
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
                  <label className="admin-label">Description & Architectural Notes</label>
                  <textarea
                    placeholder="Enter full technical and silhouette details..."
                    rows="3"
                    disabled={isSubmitting}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="admin-textarea"
                  />
                </div>
              </div>
            </div>

            <div className="admin-section-card">
              <h3 className="admin-section-card-title">Commercial Pricing & Catalog Placement</h3>
              <p className="admin-section-card-desc">Set original strike price and active promotional selling price.</p>

              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Base / Original Price (INR) *</label>
                  <input
                    type="number"
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
                    Discount Price (INR) {discountCalc !== null && <span style={{ color: "#16a34a", fontWeight: "700" }}>({discountCalc}% OFF)</span>}
                  </label>
                  <input
                    type="number"
                    placeholder="999.00"
                    disabled={isSubmitting}
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    className="admin-input"
                  />
                </div>
              </div>

              <div style={{ marginTop: "20px" }}>
                <label className="admin-label">Promotional & Discover Tags</label>
                <div className="discovery-badges-row">
                  <label className={`discovery-badge-pill ${isBestSeller ? "active" : ""}`}>
                    <input
                      type="checkbox"
                      disabled={isSubmitting}
                      checked={isBestSeller}
                      onChange={(e) => setIsBestSeller(e.target.checked)}
                    />
                    <span className="pill-indicator">{isBestSeller ? "✓" : "+"}</span>
                    <span>Best Seller Badge</span>
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
                    <span>Featured on Home Archive</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. TAB 2: VARIANTS & GALLERY */}
        {activeTab === "variants" && (
          <div className="admin-tab-panel">
            <div className="admin-section-card">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div>
                  <h3 className="admin-section-card-title">Inventory Variants & Media</h3>
                  <p className="admin-section-card-desc" style={{ marginBottom: 0 }}>
                    Configure sizes, colors, SKUs, and upload high-res showcase photos.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleAddVariantRow}
                  style={{
                    background: "#000",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    padding: "8px 14px",
                    fontSize: "12px",
                    fontWeight: "700",
                    cursor: "pointer",
                    textTransform: "uppercase",
                  }}
                >
                  + Add Variant
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {variants.map((v, idx) => (
                  <div
                    key={v.id}
                    style={{
                      background: "#fafafa",
                      border: "1px solid #e4e4e7",
                      borderRadius: "6px",
                      padding: "16px",
                      position: "relative",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                      <span style={{ fontSize: "12px", fontWeight: "750", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Variant 0{idx + 1}
                      </span>
                      {variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveVariantRow(v.id)}
                          style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}
                        >
                          ✕ Remove
                        </button>
                      )}
                    </div>

                    <div className="admin-grid-4">
                      <div className="admin-form-group">
                        <label className="admin-label">SKU *</label>
                        <input
                          type="text"
                          placeholder="e.g. OSM-240G-OVT-01"
                          required
                          value={v.sku}
                          onChange={(e) => handleVariantChange(v.id, "sku", e.target.value)}
                          className="admin-input"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">Size</label>
                        <select
                          value={v.size}
                          onChange={(e) => handleVariantChange(v.id, "size", e.target.value)}
                          className="admin-select"
                        >
                          <option value="">Select Size</option>
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L">L</option>
                          <option value="XL">XL</option>
                          <option value="XXL">XXL</option>
                        </select>
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">Color</label>
                        <input
                          type="text"
                          placeholder="e.g. Onyx Black"
                          value={v.color}
                          onChange={(e) => handleVariantChange(v.id, "color", e.target.value)}
                          className="admin-input"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">Stock Units</label>
                        <input
                          type="number"
                          placeholder="100"
                          value={v.stock}
                          onChange={(e) => handleVariantChange(v.id, "stock", e.target.value)}
                          className="admin-input"
                        />
                      </div>
                    </div>

                    <VariantImageUploader
                      imageUrls={v.imageUrls || []}
                      files={v.files || []}
                      maxImages={3}
                      onUrlsChange={(newUrls) => handleVariantChange(v.id, "imageUrls", newUrls)}
                      onFilesChange={(newFiles) => handleVariantChange(v.id, "files", newFiles)}
                      disabled={isSubmitting}
                      variantLabel={`Variant 0${idx + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. TAB 3: ARCHITECTURAL SPECS & FABRIC */}
        {activeTab === "specs" && (
          <div className="admin-tab-panel">
            <div className="admin-section-card">
              <h3 className="admin-section-card-title">Editorial Specs & Overlays</h3>
              <p className="admin-section-card-desc">Configure the text pills, badges, model specifications, and fit notes displayed around the showcase image.</p>

              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Edition Tag (Top Header)</label>
                  <input
                    type="text"
                    value={edition}
                    onChange={(e) => setEdition(e.target.value)}
                    placeholder="EDITION 01 // CORE ESSENTIALS"
                    className="admin-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Fabric GSM Pill</label>
                  <input
                    type="text"
                    value={fabricGsm}
                    onChange={(e) => setFabricGsm(e.target.value)}
                    placeholder="240 GSM INTERLOCK"
                    className="admin-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Top Image Discount Pill</label>
                  <input
                    type="text"
                    value={badgeLabel}
                    onChange={(e) => setBadgeLabel(e.target.value)}
                    placeholder="20% OFF ARCHIVE"
                    className="admin-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Top Image Batch Pill</label>
                  <input
                    type="text"
                    value={batchLabel}
                    onChange={(e) => setBatchLabel(e.target.value)}
                    placeholder="BATCH 01 / ESSENTIALS"
                    className="admin-input"
                  />
                </div>
              </div>

              <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <div className="admin-form-group">
                  <label className="admin-label">Model Spec Overlay (Bottom of Showcase Image)</label>
                  <input
                    type="text"
                    value={modelSpec}
                    onChange={(e) => setModelSpec(e.target.value)}
                    placeholder="MODEL SPEC: 6'1&quot; (185 CM) / 78 KG — WEARS SIZE L"
                    className="admin-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Fit & Drape Recommendation Note</label>
                  <textarea
                    rows="2"
                    value={fitNote}
                    onChange={(e) => setFitNote(e.target.value)}
                    placeholder="Boxy silhouette. True-to-size gives the intended dramatic drape..."
                    className="admin-textarea"
                  />
                </div>
              </div>
            </div>

            <div className="admin-section-card">
              <h3 className="admin-section-card-title">4 Technical Feature Boxes</h3>
              <p className="admin-section-card-desc">The 4 technical feature blocks displayed above the accordions.</p>

              <div className="admin-grid-2">
                {techFeatures.map((tf, idx) => (
                  <div key={idx} className="tech-feature-card">
                    <span className="tech-feature-num">Feature Box 0{idx + 1}</span>
                    <input
                      type="text"
                      placeholder="Heading (e.g. 240 GSM KNIT)"
                      value={tf.heading}
                      onChange={(e) => handleTechFeatureChange(idx, "heading", e.target.value)}
                      className="admin-input"
                      style={{ fontWeight: "700" }}
                    />
                    <textarea
                      rows="2"
                      placeholder="Description"
                      value={tf.desc}
                      onChange={(e) => handleTechFeatureChange(idx, "desc", e.target.value)}
                      className="admin-textarea"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. TAB 4: MACRO DETAIL TILES & CROSS-SELLS */}
        {activeTab === "tiles" && (
          <div className="admin-tab-panel">
            <div className="admin-section-card">
              <h3 className="admin-section-card-title">4 Architectural Macro Detail Tiles</h3>
              <p className="admin-section-card-desc">High-resolution close-ups of fabric weaves, rib collars, dropped shoulder seams, and styling.</p>

              <div className="macro-tiles-grid">
                {macroTiles.map((tile, idx) => (
                  <div key={idx} className="macro-tile-builder">
                    <div className="tile-builder-header">
                      <span className="tech-feature-num">Detail Tile 0{idx + 1}</span>
                    </div>

                    {tile.imageUrl && (
                      <img src={tile.imageUrl} alt={`Preview ${idx + 1}`} className="tile-preview-thumb" />
                    )}

                    <div className="admin-form-group">
                      <label className="admin-label">Image URL</label>
                      <input
                        type="text"
                        placeholder="https://..."
                        value={tile.imageUrl}
                        onChange={(e) => handleMacroTileChange(idx, "imageUrl", e.target.value)}
                        className="admin-input"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-label">Tag Overlay</label>
                      <input
                        type="text"
                        placeholder="e.g. 240 GSM COMBED COMPACT COTTON"
                        value={tile.tag}
                        onChange={(e) => handleMacroTileChange(idx, "tag", e.target.value)}
                        className="admin-input"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-label">Title</label>
                      <input
                        type="text"
                        placeholder="e.g. High-density yarn-spun 40s/2-ply"
                        value={tile.title}
                        onChange={(e) => handleMacroTileChange(idx, "title", e.target.value)}
                        className="admin-input"
                        style={{ fontWeight: "650" }}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-label">Description</label>
                      <textarea
                        rows="2"
                        placeholder="Interlock compact weaving prevents..."
                        value={tile.desc}
                        onChange={(e) => handleMacroTileChange(idx, "desc", e.target.value)}
                        className="admin-textarea"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-section-card">
              <h3 className="admin-section-card-title">Complete The Look (Bundle Cross-Sells)</h3>
              <p className="admin-section-card-desc">Select up to 3 complementary catalog items to recommend in the bundle section.</p>

              <div className="bundle-selector-wrap">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleToggleBundleId(e.target.value);
                      e.target.value = "";
                    }
                  }}
                  className="admin-select"
                >
                  <option value="">+ Add complementary catalog piece...</option>
                  {catalogProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — ₹{p.discountPrice || p.price}
                    </option>
                  ))}
                </select>

                <div className="bundle-chips-row">
                  {bundleIds.map((bId) => {
                    const match = catalogProducts.find((p) => p.id === bId);
                    return (
                      <span key={bId} className="bundle-chip">
                        <span>{match ? match.name : bId}</span>
                        <button
                          type="button"
                          onClick={() => handleToggleBundleId(bId)}
                          className="bundle-chip-remove"
                        >
                          ✕
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. TAB 5: ACCORDIONS & SIZE GUIDE */}
        {activeTab === "accordions" && (
          <div className="admin-tab-panel">
            <div className="admin-section-card">
              <h3 className="admin-section-card-title">Technical Accordions</h3>
              <p className="admin-section-card-desc">Expandable editorial dropdowns for tailoring specifications, shipping logistics, and fabric care.</p>

              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <div className="admin-form-group">
                  <label className="admin-label">1. Silhouette Specification & Tailoring (Bullet points, one per line)</label>
                  <textarea
                    rows="6"
                    value={Array.isArray(accordions.silhouette) ? accordions.silhouette.join("\n") : accordions.silhouette}
                    onChange={(e) => handleAccordionChange("silhouette", e.target.value.split("\n"))}
                    className="admin-textarea"
                    placeholder="Enter each tailoring feature on a new line..."
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">2. Air Logistics, Tracking & Dispatch</label>
                  <textarea
                    rows="3"
                    value={accordions.logistics || ""}
                    onChange={(e) => handleAccordionChange("logistics", e.target.value)}
                    className="admin-textarea"
                    placeholder="Orders are carefully packed in protective matte security foil..."
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">3. Fabric Care Protocol & Longevity</label>
                  <textarea
                    rows="3"
                    value={accordions.care || ""}
                    onChange={(e) => handleAccordionChange("care", e.target.value)}
                    className="admin-textarea"
                    placeholder="Machine wash cold (30°C) inside out with mild detergent..."
                  />
                </div>
              </div>
            </div>

            <div className="admin-section-card">
              <h3 className="admin-section-card-title">Size Guide Measurement Matrix</h3>
              <p className="admin-section-card-desc">Interactive dimension matrix (in inches) shown in the popup size guide.</p>

              <div className="admin-size-table-wrap">
                <table className="admin-size-matrix-table">
                  <thead>
                    <tr>
                      <th>Size</th>
                      <th>Chest Width</th>
                      <th>Body Length</th>
                      <th>Shoulder Drop</th>
                      <th>Sleeve Opening</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeGuide.map((row, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: "750" }}>{row.size}</td>
                        <td>
                          <input
                            type="text"
                            value={row.chest}
                            onChange={(e) => handleSizeGuideChange(idx, "chest", e.target.value)}
                            className="matrix-cell-input"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={row.length}
                            onChange={(e) => handleSizeGuideChange(idx, "length", e.target.value)}
                            className="matrix-cell-input"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={row.shoulder}
                            onChange={(e) => handleSizeGuideChange(idx, "shoulder", e.target.value)}
                            className="matrix-cell-input"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={row.sleeve}
                            onChange={(e) => handleSizeGuideChange(idx, "sleeve", e.target.value)}
                            className="matrix-cell-input"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 7. BOTTOM SUBMIT & TAB NAVIGATION BAR */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#ffffff",
            padding: "18px 24px",
            borderRadius: "8px",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
          }}
        >
          <div style={{ display: "flex", gap: "10px" }}>
            {activeTab !== "basics" && (
              <button
                type="button"
                onClick={() => {
                  const tabs = ["basics", "variants", "specs", "tiles", "accordions"];
                  const prevIdx = tabs.indexOf(activeTab) - 1;
                  if (prevIdx >= 0) setActiveTab(tabs[prevIdx]);
                }}
                style={{
                  background: "#f4f4f5",
                  border: "1px solid #d4d4d8",
                  padding: "9px 18px",
                  borderRadius: "5px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                ← Previous Tab
              </button>
            )}

            {activeTab !== "accordions" && (
              <button
                type="button"
                onClick={() => {
                  const tabs = ["basics", "variants", "specs", "tiles", "accordions"];
                  const nextIdx = tabs.indexOf(activeTab) + 1;
                  if (nextIdx < tabs.length) setActiveTab(tabs[nextIdx]);
                }}
                style={{
                  background: "#f4f4f5",
                  border: "1px solid #d4d4d8",
                  padding: "9px 18px",
                  borderRadius: "5px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Next Tab →
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              background: "#000000",
              color: "#ffffff",
              border: "none",
              padding: "12px 28px",
              borderRadius: "5px",
              fontFamily: "Inter, sans-serif",
              fontSize: "13.5px",
              fontWeight: "750",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.16)",
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting ? "Publishing Garment..." : "Publish Product Listing ↗"}
          </button>
        </div>
      </form>
    </div>
  );
}
