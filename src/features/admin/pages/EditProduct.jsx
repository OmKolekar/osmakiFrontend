import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import categoryApi from "../api/categoryApi";
import productApi from "../api/productApi";
import productService from "../services/productService";
import VariantImageUploader from "../components/VariantImageUploader";
import {
  DEFAULT_TECH_FEATURES,
  DEFAULT_MACRO_TILES,
  DEFAULT_ACCORDIONS,
  DEFAULT_SIZE_GUIDE,
} from "../data/defaultEditorialSpecs";
import "../styles/adminTabs.css";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Active Tab state: 'basics' | 'variants' | 'specs' | 'tiles' | 'accordions'
  const [activeTab, setActiveTab] = useState("basics");

  // Loading & Reference Data
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [catalogProducts, setCatalogProducts] = useState([]);

  // Tab 1: Basics & Pricing
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [gender, setGender] = useState("Unisex");
  const [brand, setBrand] = useState("OSMAKI");

  // Promotional Toggles
  const [isTrending, setIsTrending] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);

  // Tab 2: Variants Array
  const [variants, setVariants] = useState([]);

  // Tab 3: Specs & Fabric Details
  const [edition, setEdition] = useState("EDITION 01 // CORE ESSENTIALS");
  const [fabricGsm, setFabricGsm] = useState("240 GSM INTERLOCK");
  const [badgeLabel, setBadgeLabel] = useState("20% OFF ARCHIVE");
  const [batchLabel, setBatchLabel] = useState("BATCH 01 / ESSENTIALS");
  const [modelSpec, setModelSpec] = useState("MODEL SPEC: 6'1\" (185 CM) / 78 KG — WEARS SIZE L");
  const [fitNote, setFitNote] = useState("Boxy silhouette. True-to-size gives the intended dramatic drape; size down for standard tailored fit.");
  const [techFeatures, setTechFeatures] = useState(DEFAULT_TECH_FEATURES);

  // Tab 4: Macro Tiles & Cross-Sells
  const [macroTiles, setMacroTiles] = useState(DEFAULT_MACRO_TILES);
  const [bundleIds, setBundleIds] = useState([]);

  // Tab 5: Accordions & Size Guide
  const [accordions, setAccordions] = useState(DEFAULT_ACCORDIONS);
  const [sizeGuide, setSizeGuide] = useState(DEFAULT_SIZE_GUIDE);

  // Status & Notifications
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load product and categories on mount
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setErrorMsg("");

        const [catRes, prodListRes, productRes] = await Promise.allSettled([
          categoryApi.getCategories(),
          productApi.getProducts(),
          productApi.getProductById(id),
        ]);

        if (catRes.status === "fulfilled" && Array.isArray(catRes.value)) {
          setCategories(catRes.value);
        }

        if (prodListRes.status === "fulfilled" && Array.isArray(prodListRes.value)) {
          setCatalogProducts(prodListRes.value.filter((p) => String(p.id) !== String(id)));
        }

        if (productRes.status === "fulfilled" && productRes.value) {
          const p = productRes.value;
          setName(p.name || "");
          setSubtitle(p.subtitle || "Washed Onyx Black • Dropped Shoulder Silhouette • Pre-Shrunk Luxury Fit");
          setDescription(p.description || "");
          setBasePrice(p.price || "");
          setDiscountPrice(p.discountPrice || "");
          setCategoryId(p.categoryId || "");
          setGender(p.gender || "Unisex");
          setBrand(p.brand || "OSMAKI");

          setIsTrending(p.isTrending || false);
          setIsFeatured(p.isFeatured || false);
          setIsBestSeller(p.isBestSeller || false);

          setEdition(p.edition || "EDITION 01 // CORE ESSENTIALS");
          setFabricGsm(p.fabricGsm || "240 GSM INTERLOCK");
          setBadgeLabel(p.badgeLabel || "20% OFF ARCHIVE");
          setBatchLabel(p.batchLabel || "BATCH 01 / ESSENTIALS");
          setModelSpec(p.modelSpec || "MODEL SPEC: 6'1\" (185 CM) / 78 KG — WEARS SIZE L");
          setFitNote(p.fitNote || "Boxy silhouette. True-to-size gives the intended dramatic drape; size down for standard tailored fit.");

          setTechFeatures(
            p.techFeatures && Array.isArray(p.techFeatures) && p.techFeatures.length > 0
              ? p.techFeatures
              : DEFAULT_TECH_FEATURES
          );
          setMacroTiles(
            p.macroTiles && Array.isArray(p.macroTiles) && p.macroTiles.length > 0
              ? p.macroTiles
              : DEFAULT_MACRO_TILES
          );
          setAccordions(
            p.accordions && Object.keys(p.accordions).length > 0
              ? p.accordions
              : DEFAULT_ACCORDIONS
          );
          setSizeGuide(
            p.sizeGuide && Array.isArray(p.sizeGuide) && p.sizeGuide.length > 0
              ? p.sizeGuide
              : DEFAULT_SIZE_GUIDE
          );
          setBundleIds(p.bundleIds && Array.isArray(p.bundleIds) ? p.bundleIds : []);

          if (p.variants && Array.isArray(p.variants) && p.variants.length > 0) {
            setVariants(
              p.variants.map((v) => ({
                id: v.id,
                sku: v.sku || "",
                size: v.size || "",
                color: v.color || "",
                price: v.price || "",
                discountPrice: v.discountPrice || "",
                stock: v.stock !== undefined ? v.stock : 0,
                imageUrls: v.images?.map((img) => img.imageUrl) || (v.imageUrl ? [v.imageUrl] : []),
                files: [],
              }))
            );
          } else {
            setVariants([
              {
                id: null,
                sku: "OSM-VAR-01",
                size: "L",
                color: "Black",
                price: p.price || "",
                discountPrice: p.discountPrice || "",
                stock: 100,
                imageUrls: p.image ? [p.image] : [],
                files: [],
              },
            ]);
          }
        } else {
          setErrorMsg("Garment not found or failed to retrieve.");
        }
      } catch (err) {
        console.error("Error loading product for editing:", err);
        setErrorMsg("Failed to load product details.");
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      loadData();
    }
  }, [id]);

  // Variant Helpers
  const handleAddVariantRow = () => {
    setVariants([
      ...variants,
      {
        id: null,
        sku: "",
        size: "",
        color: "",
        price: "",
        discountPrice: "",
        stock: 0,
        imageUrls: [],
        files: [],
      },
    ]);
  };

  const handleRemoveVariantRow = (index) => {
    if (variants.length === 1) {
      setErrorMsg("A product must contain at least one variant configuration.");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }
    setVariants(variants.filter((_, idx) => idx !== index));
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  // Tech Features Helper
  const handleTechFeatureChange = (index, field, value) => {
    const updated = [...techFeatures];
    updated[index] = { ...updated[index], [field]: value };
    setTechFeatures(updated);
  };

  // Macro Tiles Helper
  const handleMacroTileChange = (index, field, value) => {
    const updated = [...macroTiles];
    updated[index] = { ...updated[index], [field]: value };
    setMacroTiles(updated);
  };

  // Size Guide Matrix Helper
  const handleSizeGuideChange = (index, field, value) => {
    const updated = [...sizeGuide];
    updated[index] = { ...updated[index], [field]: value };
    setSizeGuide(updated);
  };

  // Accordion Helper
  const handleAccordionChange = (key, value) => {
    setAccordions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Bundle Helper
  const handleToggleBundleId = (bundleId) => {
    if (bundleIds.includes(bundleId)) {
      setBundleIds(bundleIds.filter((bId) => bId !== bundleId));
    } else {
      if (bundleIds.length >= 3) {
        setErrorMsg("Maximum 3 cross-sell products can be bundled.");
        setTimeout(() => setErrorMsg(""), 3000);
        return;
      }
      setBundleIds([...bundleIds, bundleId]);
    }
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMsg("Product Name is required.");
      return;
    }

    if (variants.some((v) => !v.sku.trim())) {
      setErrorMsg("Each variant must possess a unique SKU.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg("");

      const productForm = {
        name,
        subtitle,
        description,
        basePrice,
        discountPrice,
        categoryId,
        gender,
        brand,
        isTrending,
        isFeatured,
        isBestSeller,
        edition,
        fabricGsm,
        badgeLabel,
        batchLabel,
        modelSpec,
        fitNote,
        techFeatures,
        macroTiles,
        accordions,
        sizeGuide,
        bundleIds,
      };

      await productService.updateProduct(id, productForm, variants);

      setSuccessMsg("Product specifications and media successfully updated! Redirecting to inventory...");
      setTimeout(() => {
        navigate("/admin/inventory");
      }, 1500);
    } catch (err) {
      console.error("Update failed:", err);
      setErrorMsg(err.message || "Failed to update product specifications.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center" }}>
        <p style={{ fontSize: "16px", color: "#666" }}>Loading garment specifications...</p>
      </div>
    );
  }

  return (
    <div className="admin-page-container">
      {/* 1. EDIT PAGE HEADER */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <button
            type="button"
            onClick={() => navigate("/admin/inventory")}
            style={{
              background: "#f4f4f5",
              border: "1px solid #e4e4e7",
              borderRadius: "4px",
              padding: "6px 12px",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
              color: "#18181b",
            }}
          >
            ← Back to Inventory
          </button>
          <span style={{ fontSize: "12px", color: "#71717a", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            PRODUCT ID: #{id}
          </span>
        </div>
        <h1 className="admin-page-title" style={{ margin: "0 0 6px 0" }}>
          Edit Garment Specifications
        </h1>
        <p className="admin-page-subtitle" style={{ margin: 0 }}>
          Update commercial pricing, variants, and dynamic architectural details for <strong>{name}</strong>.
        </p>
      </div>

      {/* Floating Notifications */}
      {errorMsg && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #f87171",
            color: "#991b1b",
            padding: "12px 16px",
            borderRadius: "6px",
            marginBottom: "20px",
            fontSize: "13px",
            fontWeight: "500",
          }}
        >
          ✕ {errorMsg}
        </div>
      )}

      {successMsg && (
        <div
          style={{
            background: "#f0fdf4",
            border: "1px solid #4ade80",
            color: "#166534",
            padding: "12px 16px",
            borderRadius: "6px",
            marginBottom: "20px",
            fontSize: "13px",
            fontWeight: "500",
          }}
        >
          ✓ {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-tabs-container">
        {/* 2. SEGMENTED CONTROL TABS */}
        <div className="admin-tab-strip" role="tablist">
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
            <span>📷 Detail Tiles & Bundles</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === "accordions" ? "active" : ""}`}
            onClick={() => setActiveTab("accordions")}
          >
            <span>📋 Accordions & Size Guide</span>
          </button>
        </div>

        {/* =========================================================================
            TAB 1: BASICS & PRICING
           ========================================================================= */}
        {activeTab === "basics" && (
          <div className="admin-tab-panel">
            <div className="admin-section-card">
              <h3 className="admin-section-card-title">Identity & Categorization</h3>
              <p className="admin-section-card-desc">
                Configure primary title, architectural subtitle, and collection taxonomy.
              </p>

              <div className="admin-grid-1" style={{ gap: "16px" }}>
                <div className="admin-form-group">
                  <label className="admin-label">Product Name *</label>
                  <input
                    type="text"
                    required
                    disabled={isSubmitting}
                    placeholder="e.g. 240 GSM Oversized Heavyweight Tee"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="admin-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Subtitle (Below Product Name on Storefront)</label>
                  <input
                    type="text"
                    disabled={isSubmitting}
                    placeholder="e.g. Washed Onyx Black • Dropped Shoulder Silhouette • Pre-Shrunk Luxury Fit"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="admin-input"
                  />
                </div>

                <div className="admin-grid-3">
                  <div className="admin-form-group">
                    <label className="admin-label">Category *</label>
                    <select
                      required
                      disabled={isSubmitting}
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="admin-select"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Gender</label>
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
                      disabled={isSubmitting}
                      placeholder="e.g. OSMAKI"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="admin-input"
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Description</label>
                  <textarea
                    rows="3"
                    disabled={isSubmitting}
                    placeholder="Comprehensive description of cut, drape, and inspiration..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="admin-textarea"
                  />
                </div>
              </div>
            </div>

            <div className="admin-section-card">
              <h3 className="admin-section-card-title">Pricing & Discovery Toggles</h3>
              <p className="admin-section-card-desc">
                Set baseline retail pricing and storefront collection badges.
              </p>

              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Base Retail Price (INR ₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    disabled={isSubmitting}
                    placeholder="2499.00"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    className="admin-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Discount Price (INR ₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    disabled={isSubmitting}
                    placeholder="1999.00"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    className="admin-input"
                  />
                </div>
              </div>

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
        )}

        {/* =========================================================================
            TAB 2: VARIANTS & STOCK (WITH PROPER 3-PHOTO UPLOADER & PREVIEWS)
           ========================================================================= */}
        {activeTab === "variants" && (
          <div className="admin-tab-panel">
            <div className="admin-section-card">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div>
                  <h3 className="admin-section-card-title">Inventory Variants & Media</h3>
                  <p className="admin-section-card-desc" style={{ marginBottom: 0 }}>
                    Configure sizes, colors, SKUs, and upload high-res showcase photos (Maximum 3 photos per variant).
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
                    key={v.id || idx}
                    style={{
                      background: "#fafafa",
                      border: "1px solid #e4e4e7",
                      borderRadius: "8px",
                      padding: "18px",
                      position: "relative",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                      <span style={{ fontSize: "12.5px", fontWeight: "750", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Variant 0{idx + 1} {v.sku && `(${v.sku})`}
                      </span>
                      {variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveVariantRow(idx)}
                          style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}
                        >
                          ✕ Remove Variant
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
                          onChange={(e) => handleVariantChange(idx, "sku", e.target.value)}
                          className="admin-input"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">Size</label>
                        <select
                          value={v.size}
                          onChange={(e) => handleVariantChange(idx, "size", e.target.value)}
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
                          onChange={(e) => handleVariantChange(idx, "color", e.target.value)}
                          className="admin-input"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">Stock Units</label>
                        <input
                          type="number"
                          placeholder="100"
                          value={v.stock}
                          onChange={(e) => handleVariantChange(idx, "stock", e.target.value)}
                          className="admin-input"
                        />
                      </div>
                    </div>

                    {/* Proper 3-Photo Uploader Component */}
                    <VariantImageUploader
                      imageUrls={v.imageUrls || []}
                      files={v.files || []}
                      maxImages={3}
                      onUrlsChange={(newUrls) => handleVariantChange(idx, "imageUrls", newUrls)}
                      onFilesChange={(newFiles) => handleVariantChange(idx, "files", newFiles)}
                      disabled={isSubmitting}
                      variantLabel={`Variant 0${idx + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: SPECS & FABRIC
           ========================================================================= */}
        {activeTab === "specs" && (
          <div className="admin-tab-panel">
            <div className="admin-section-card">
              <h3 className="admin-section-card-title">Editorial Specs & Textile Engineering</h3>
              <p className="admin-section-card-desc">
                Configure edition, fabric GSM, overlay badges, and model dimensions.
              </p>

              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Edition Title (Eyebrow)</label>
                  <input
                    type="text"
                    value={edition}
                    onChange={(e) => setEdition(e.target.value)}
                    className="admin-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Fabric GSM & Weave Specification</label>
                  <input
                    type="text"
                    value={fabricGsm}
                    onChange={(e) => setFabricGsm(e.target.value)}
                    className="admin-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Hero Badge 1 (Discount/Sale)</label>
                  <input
                    type="text"
                    value={badgeLabel}
                    onChange={(e) => setBadgeLabel(e.target.value)}
                    className="admin-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Hero Badge 2 (Batch/Collection)</label>
                  <input
                    type="text"
                    value={batchLabel}
                    onChange={(e) => setBatchLabel(e.target.value)}
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="admin-form-group" style={{ marginTop: "14px" }}>
                <label className="admin-label">Model Spec Overlay (Bottom of Photo Frame)</label>
                <input
                  type="text"
                  value={modelSpec}
                  onChange={(e) => setModelSpec(e.target.value)}
                  className="admin-input"
                />
              </div>

              <div className="admin-form-group" style={{ marginTop: "14px" }}>
                <label className="admin-label">Fit / Drape Recommendation Note (Under Size Buttons)</label>
                <textarea
                  rows="2"
                  value={fitNote}
                  onChange={(e) => setFitNote(e.target.value)}
                  className="admin-textarea"
                />
              </div>
            </div>

            <div className="admin-section-card">
              <h3 className="admin-section-card-title">4 Technical Feature Cards</h3>
              <p className="admin-section-card-desc">
                Displayed in the 2x2 grid under the trust badges on storefront product details.
              </p>

              <div className="admin-grid-2">
                {techFeatures.map((tf, idx) => (
                  <div key={idx} className="tech-feature-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span className="tech-feature-num">FEATURE 0{idx + 1}</span>
                      <span style={{ fontSize: "10.5px", color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: "600" }}>STOREFRONT HIGHLIGHT</span>
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Feature Heading</label>
                      <input
                        type="text"
                        value={tf.heading}
                        onChange={(e) => handleTechFeatureChange(idx, "heading", e.target.value)}
                        className="admin-input"
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Feature Description</label>
                      <input
                        type="text"
                        value={tf.desc}
                        onChange={(e) => handleTechFeatureChange(idx, "desc", e.target.value)}
                        className="admin-input"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: DETAIL TILES & BUNDLES
           ========================================================================= */}
        {activeTab === "tiles" && (
          <div className="admin-tab-panel">
            <div className="admin-section-card">
              <h3 className="admin-section-card-title">4 Architectural Macro Detail Tiles</h3>
              <p className="admin-section-card-desc">
                Visual cards showing collar ribbing, fabric close-up, dropped shoulder cut, and editorial styling.
              </p>

              <div className="macro-tiles-grid">
                {macroTiles.map((tile, idx) => (
                  <div key={idx} className="macro-tile-builder">
                    <div className="tile-builder-header">
                      <span className="tech-feature-num">Detail Tile 0{idx + 1}</span>
                    </div>

                    {tile.imageUrl && (
                      <img
                        src={tile.imageUrl}
                        alt={`Preview 0${idx + 1}`}
                        className="tile-preview-thumb"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
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
              <h3 className="admin-section-card-title">"Complete The Fit" Cross-Sell Bundles</h3>
              <p className="admin-section-card-desc">
                Select complementary garments (Max 3) from your live catalog to cross-sell with this piece.
              </p>

              <div className="bundle-selection-chips">
                {catalogProducts.map((p) => {
                  const isSelected = bundleIds.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleToggleBundleId(p.id)}
                      className={`bundle-chip ${isSelected ? "selected" : ""}`}
                      style={{
                        background: isSelected ? "#000" : "#f4f4f5",
                        color: isSelected ? "#fff" : "#18181b",
                        border: isSelected ? "1px solid #000" : "1px solid #e4e4e7",
                        cursor: "pointer",
                      }}
                    >
                      <span>{isSelected ? "✓" : "+"}</span>
                      <span>{p.name} (₹{p.price})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: ACCORDIONS & SIZE GUIDE
           ========================================================================= */}
        {activeTab === "accordions" && (
          <div className="admin-tab-panel">
            <div className="admin-section-card">
              <h3 className="admin-section-card-title">Collapsible Editorial Accordions</h3>
              <p className="admin-section-card-desc">
                Fine-tune garment construction notes, air dispatch logistics, and wash care protocols.
              </p>

              <div className="admin-form-group">
                <label className="admin-label">Accordion 1: Tailoring & Silhouette Bullets (1 per line)</label>
                <textarea
                  rows="6"
                  value={
                    Array.isArray(accordions.silhouette)
                      ? accordions.silhouette.join("\n")
                      : accordions.silhouette || ""
                  }
                  onChange={(e) =>
                    handleAccordionChange(
                      "silhouette",
                      e.target.value.split("\n").filter((l) => l.trim().length > 0)
                    )
                  }
                  className="admin-textarea"
                />
              </div>

              <div className="admin-form-group" style={{ marginTop: "14px" }}>
                <label className="admin-label">Accordion 2: Air Logistics & Tracking</label>
                <textarea
                  rows="3"
                  value={accordions.logistics || ""}
                  onChange={(e) => handleAccordionChange("logistics", e.target.value)}
                  className="admin-textarea"
                />
              </div>

              <div className="admin-form-group" style={{ marginTop: "14px" }}>
                <label className="admin-label">Accordion 3: Fabric Care Protocol</label>
                <textarea
                  rows="3"
                  value={accordions.care || ""}
                  onChange={(e) => handleAccordionChange("care", e.target.value)}
                  className="admin-textarea"
                />
              </div>
            </div>

            <div className="admin-section-card">
              <h3 className="admin-section-card-title">Size Guide Matrix (Inches)</h3>
              <p className="admin-section-card-desc">
                Calibrated dimensions rendered inside the customer Size Guide Modal.
              </p>

              <div className="admin-size-table-wrap">
                <table className="admin-matrix-editor">
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
                      <tr key={row.size || idx}>
                        <td>
                          <strong>{row.size}</strong>
                        </td>
                        <td>
                          <input
                            type="text"
                            value={row.chest}
                            onChange={(e) => handleSizeGuideChange(idx, "chest", e.target.value)}
                            className="admin-input-cell"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={row.length}
                            onChange={(e) => handleSizeGuideChange(idx, "length", e.target.value)}
                            className="admin-input-cell"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={row.shoulder}
                            onChange={(e) => handleSizeGuideChange(idx, "shoulder", e.target.value)}
                            className="admin-input-cell"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={row.sleeve}
                            onChange={(e) => handleSizeGuideChange(idx, "sleeve", e.target.value)}
                            className="admin-input-cell"
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

        {/* 6. BOTTOM NAVIGATION & SUBMISSION BAR */}
        <div className="admin-bottom-actions-bar">
          <div style={{ display: "flex", gap: "10px" }}>
            {activeTab !== "basics" && (
              <button
                type="button"
                className="admin-btn-secondary"
                onClick={() => {
                  const tabs = ["basics", "variants", "specs", "tiles", "accordions"];
                  const currIdx = tabs.indexOf(activeTab);
                  if (currIdx > 0) setActiveTab(tabs[currIdx - 1]);
                }}
              >
                ← Previous Tab
              </button>
            )}

            {activeTab !== "accordions" && (
              <button
                type="button"
                className="admin-btn-secondary"
                onClick={() => {
                  const tabs = ["basics", "variants", "specs", "tiles", "accordions"];
                  const currIdx = tabs.indexOf(activeTab);
                  if (currIdx < tabs.length - 1) setActiveTab(tabs[currIdx + 1]);
                }}
              >
                Next Tab →
              </button>
            )}
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button
              type="button"
              onClick={() => navigate("/admin/inventory")}
              disabled={isSubmitting}
              className="admin-btn-secondary"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="admin-btn-primary"
            >
              {isSubmitting ? "Saving Changes..." : "Save Product Changes ✓"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
