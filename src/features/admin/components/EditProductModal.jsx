import React, { useState, useEffect } from "react";
import categoryApi from "../api/categoryApi";
import productApi from "../api/productApi";
import {
  DEFAULT_TECH_FEATURES,
  DEFAULT_MACRO_TILES,
  DEFAULT_ACCORDIONS,
  DEFAULT_SIZE_GUIDE,
} from "../data/defaultEditorialSpecs";
import "../styles/adminTabs.css";

export default function EditProductModal({ isOpen, product, onClose, onSave }) {
  const [activeTab, setActiveTab] = useState("basics");
  const [categories, setCategories] = useState([]);
  const [catalogProducts, setCatalogProducts] = useState([]);

  // Tab 1: Product details
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [gender, setGender] = useState("Unisex");
  const [brand, setBrand] = useState("");

  // Promotion Toggles
  const [isTrending, setIsTrending] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);

  // Tab 2: Variants
  const [variants, setVariants] = useState([]);

  // Tab 3: Specs & Fabric
  const [edition, setEdition] = useState("");
  const [fabricGsm, setFabricGsm] = useState("");
  const [badgeLabel, setBadgeLabel] = useState("");
  const [batchLabel, setBatchLabel] = useState("");
  const [modelSpec, setModelSpec] = useState("");
  const [fitNote, setFitNote] = useState("");
  const [techFeatures, setTechFeatures] = useState(DEFAULT_TECH_FEATURES);

  // Tab 4: Macro Tiles & Bundles
  const [macroTiles, setMacroTiles] = useState(DEFAULT_MACRO_TILES);
  const [bundleIds, setBundleIds] = useState([]);

  // Tab 5: Accordions & Size Guide
  const [accordions, setAccordions] = useState(DEFAULT_ACCORDIONS);
  const [sizeGuide, setSizeGuide] = useState(DEFAULT_SIZE_GUIDE);

  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories and other products on open
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [catList, prodList] = await Promise.allSettled([
          categoryApi.getCategories(),
          productApi.getProducts(),
        ]);

        if (catList.status === "fulfilled" && Array.isArray(catList.value)) {
          setCategories(catList.value);
        }
        if (prodList.status === "fulfilled" && Array.isArray(prodList.value)) {
          setCatalogProducts(prodList.value);
        }
      } catch (err) {
        console.error("Failed to load initial data in Edit modal:", err);
      }
    }
    if (isOpen) {
      loadInitialData();
    }
  }, [isOpen]);

  // Sync state with product prop when modal opens
  useEffect(() => {
    if (product && isOpen) {
      setName(product.name || "");
      setSubtitle(product.subtitle || "Washed Onyx Black • Dropped Shoulder Silhouette • Pre-Shrunk Luxury Fit");
      setDescription(product.description || "");
      setBasePrice(product.price || "");
      setDiscountPrice(product.discountPrice || "");
      setCategoryId(product.categoryId || "");
      setGender(product.gender || "Unisex");
      setBrand(product.brand || "OSMAKI");

      // Promotions
      setIsTrending(product.isTrending || false);
      setIsFeatured(product.isFeatured || false);
      setIsBestSeller(product.isBestSeller || false);

      // Specs & Fabric
      setEdition(product.edition || "EDITION 01 // CORE ESSENTIALS");
      setFabricGsm(product.fabricGsm || "240 GSM INTERLOCK");
      setBadgeLabel(product.badgeLabel || "20% OFF ARCHIVE");
      setBatchLabel(product.batchLabel || "BATCH 01 / ESSENTIALS");
      setModelSpec(product.modelSpec || "MODEL SPEC: 6'1\" (185 CM) / 78 KG — WEARS SIZE L");
      setFitNote(product.fitNote || "Boxy silhouette. True-to-size gives the intended dramatic drape; size down for standard tailored fit.");

      // Structured JSONB
      setTechFeatures(
        product.techFeatures && Array.isArray(product.techFeatures) && product.techFeatures.length > 0
          ? product.techFeatures
          : DEFAULT_TECH_FEATURES
      );
      setMacroTiles(
        product.macroTiles && Array.isArray(product.macroTiles) && product.macroTiles.length > 0
          ? product.macroTiles
          : DEFAULT_MACRO_TILES
      );
      setAccordions(
        product.accordions && Object.keys(product.accordions).length > 0
          ? product.accordions
          : DEFAULT_ACCORDIONS
      );
      setSizeGuide(
        product.sizeGuide && Array.isArray(product.sizeGuide) && product.sizeGuide.length > 0
          ? product.sizeGuide
          : DEFAULT_SIZE_GUIDE
      );
      setBundleIds(product.bundleIds && Array.isArray(product.bundleIds) ? product.bundleIds : []);

      // Initialize variants
      if (product.variants && Array.isArray(product.variants)) {
        setVariants(
          product.variants.map((v) => ({
            id: v.id,
            sku: v.sku || "",
            size: v.size || "",
            color: v.color || "",
            price: v.price || "",
            discountPrice: v.discountPrice || "",
            stock: v.stock || 0,
            imageUrls: v.images?.map((img) => img.imageUrl) || (v.imageUrl ? [v.imageUrl] : []),
            files: [],
          }))
        );
      } else {
        setVariants([]);
      }

      setErrorMsg("");
      setActiveTab("basics");
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

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
    updated[index][field] = value;
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
  const handleToggleBundleId = (id) => {
    if (bundleIds.includes(id)) {
      setBundleIds(bundleIds.filter((bId) => bId !== id));
    } else {
      if (bundleIds.length >= 3) {
        setErrorMsg("Maximum 3 cross-sell products can be bundled.");
        setTimeout(() => setErrorMsg(""), 3000);
        return;
      }
      setBundleIds([...bundleIds, id]);
    }
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return setErrorMsg("Product Name is required.");
    if (variants.some((v) => !v.sku.trim())) return setErrorMsg("Each variant must possess a unique SKU.");

    try {
      setIsSubmitting(true);
      setErrorMsg("");

      const processedVariants = [];

      for (const variant of variants) {
        let currentUrls = [...(variant.imageUrls || [])];

        if (variant.files && variant.files.length > 0) {
          for (const file of variant.files) {
            try {
              const url = await productApi.uploadImage(file);
              if (url) currentUrls.push(url);
            } catch (err) {
              console.error("Failed to upload variant image:", err);
            }
          }
        }

        processedVariants.push({
          id: variant.id || undefined,
          sku: variant.sku.trim().toUpperCase(),
          size: variant.size?.trim() || null,
          color: variant.color?.trim() || null,
          price: parseFloat(variant.price) || parseFloat(basePrice) || 0,
          discountPrice: parseFloat(variant.discountPrice) || null,
          stock: parseInt(variant.stock) || 0,
          imageUrl: currentUrls.length > 0 ? currentUrls[0] : null,
          imageUrls: currentUrls,
        });
      }

      const payload = {
        name: name.trim(),
        subtitle: subtitle?.trim() || null,
        description: description?.trim() || "",
        price: parseFloat(basePrice) || 0,
        discountPrice: parseFloat(discountPrice) || null,
        categoryId: categoryId || null,
        gender: gender || "Unisex",
        brand: brand?.trim() || null,
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
        variants: processedVariants,
      };

      const updatedProduct = await productApi.updateProduct(product.id, payload);
      onSave(updatedProduct);
      onClose();
    } catch (err) {
      console.error("Error updating product:", err);
      setErrorMsg(err.message || "Failed to update product listing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        className="modal-content admin-tabs-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "1000px",
          width: "92%",
          maxHeight: "92vh",
          overflowY: "auto",
          padding: "28px",
          boxSizing: "border-box",
        }}
      >
        {/* Modal Top Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
          <div>
            <h3 className="modal-title" style={{ margin: 0 }}>Edit Garment Specifications</h3>
            <p className="modal-subtitle" style={{ margin: "4px 0 0 0" }}>
              Update commercial pricing, variants, and dynamic architectural details for <strong>{name}</strong>.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "#f4f4f5",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              cursor: "pointer",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {errorMsg && (
          <div style={{ padding: "10px 16px", backgroundColor: "#fef2f2", color: "#dc2626", borderRadius: "6px", fontSize: "13.5px", fontWeight: "500" }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* 1. SEGMENTED TABS STRIP */}
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
            <span>📦 Variants & Media</span>
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
            <span>📋 Accordions & Size Matrix</span>
          </button>
        </div>

        {/* 2. TAB 1: BASICS & PRICING */}
        {activeTab === "basics" && (
          <div className="admin-tab-panel">
            <div className="admin-section-card">
              <h4 className="admin-section-card-title">Identity & Categorization</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div className="admin-form-group">
                  <label className="admin-label">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="admin-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Subtitle (Below Product Name on Storefront)</label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Washed Onyx Black • Dropped Shoulder Silhouette • Pre-Shrunk Luxury Fit"
                    className="admin-input"
                  />
                </div>

                <div className="admin-grid-3">
                  <div className="admin-form-group">
                    <label className="admin-label">Category *</label>
                    <select
                      value={categoryId}
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
                    <label className="admin-label">Gender</label>
                    <select
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
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="admin-textarea"
                  />
                </div>
              </div>
            </div>

            <div className="admin-section-card">
              <h4 className="admin-section-card-title">Pricing & Promotion</h4>
              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Base Price (INR) *</label>
                  <input
                    type="number"
                    required
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    className="admin-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Discount Price (INR)</label>
                  <input
                    type="number"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    className="admin-input"
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "24px", marginTop: "16px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px" }}>
                  <input
                    type="checkbox"
                    checked={isBestSeller}
                    onChange={(e) => setIsBestSeller(e.target.checked)}
                    style={{ width: "18px", height: "18px", accentColor: "#000" }}
                  />
                  Best Seller
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px" }}>
                  <input
                    type="checkbox"
                    checked={isTrending}
                    onChange={(e) => setIsTrending(e.target.checked)}
                    style={{ width: "18px", height: "18px", accentColor: "#000" }}
                  />
                  Trending Drop
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px" }}>
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    style={{ width: "18px", height: "18px", accentColor: "#000" }}
                  />
                  Featured
                </label>
              </div>
            </div>
          </div>
        )}

        {/* 3. TAB 2: VARIANTS & MEDIA */}
        {activeTab === "variants" && (
          <div className="admin-tab-panel">
            <div className="admin-section-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h4 className="admin-section-card-title" style={{ margin: 0 }}>Variant Allocations & Photos</h4>
                <button
                  type="button"
                  onClick={handleAddVariantRow}
                  style={{
                    background: "#000",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    padding: "7px 12px",
                    fontSize: "12px",
                    fontWeight: "700",
                    cursor: "pointer",
                    textTransform: "uppercase",
                  }}
                >
                  + Add Variant
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {variants.map((v, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "#fafafa",
                      border: "1px solid #e4e4e7",
                      borderRadius: "6px",
                      padding: "16px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                      <span style={{ fontSize: "12px", fontWeight: "750", textTransform: "uppercase" }}>
                        Variant 0{idx + 1}
                      </span>
                      {variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveVariantRow(idx)}
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
                          required
                          value={v.sku}
                          onChange={(e) => handleVariantChange(idx, "sku", e.target.value)}
                          className="admin-input"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">Size</label>
                        <input
                          type="text"
                          value={v.size || ""}
                          onChange={(e) => handleVariantChange(idx, "size", e.target.value)}
                          className="admin-input"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">Color</label>
                        <input
                          type="text"
                          value={v.color || ""}
                          onChange={(e) => handleVariantChange(idx, "color", e.target.value)}
                          className="admin-input"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">Stock Units</label>
                        <input
                          type="number"
                          value={v.stock}
                          onChange={(e) => handleVariantChange(idx, "stock", e.target.value)}
                          className="admin-input"
                        />
                      </div>
                    </div>

                    {v.imageUrls && v.imageUrls.length > 0 && (
                      <div style={{ display: "flex", gap: "8px", marginTop: "12px", overflowX: "auto" }}>
                        {v.imageUrls.map((url, imgIdx) => (
                          <img
                            key={imgIdx}
                            src={url}
                            alt="Variant thumbnail"
                            style={{ width: "48px", height: "64px", objectFit: "cover", borderRadius: "3px", border: "1px solid #d4d4d8" }}
                          />
                        ))}
                      </div>
                    )}

                    <div style={{ marginTop: "10px" }}>
                      <label className="admin-label">Add Image Files</label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleVariantChange(idx, "files", Array.from(e.target.files))}
                        style={{ marginTop: "4px", display: "block", fontSize: "12px" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. TAB 3: SPECS & FABRIC */}
        {activeTab === "specs" && (
          <div className="admin-tab-panel">
            <div className="admin-section-card">
              <h4 className="admin-section-card-title">Editorial Specs & Overlays</h4>
              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Edition Tag</label>
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

              <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "14px" }}>
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
              <h4 className="admin-section-card-title">4 Technical Feature Boxes</h4>
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

        {/* 5. TAB 4: MACRO TILES & BUNDLES */}
        {activeTab === "tiles" && (
          <div className="admin-tab-panel">
            <div className="admin-section-card">
              <h4 className="admin-section-card-title">4 Architectural Macro Detail Tiles</h4>
              <div className="macro-tiles-grid">
                {macroTiles.map((tile, idx) => (
                  <div key={idx} className="macro-tile-builder">
                    <span className="tech-feature-num">Detail Tile 0{idx + 1}</span>
                    {tile.imageUrl && (
                      <img src={tile.imageUrl} alt={`Preview ${idx + 1}`} className="tile-preview-thumb" />
                    )}

                    <div className="admin-form-group">
                      <label className="admin-label">Image URL</label>
                      <input
                        type="text"
                        value={tile.imageUrl}
                        onChange={(e) => handleMacroTileChange(idx, "imageUrl", e.target.value)}
                        className="admin-input"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-label">Tag Overlay</label>
                      <input
                        type="text"
                        value={tile.tag}
                        onChange={(e) => handleMacroTileChange(idx, "tag", e.target.value)}
                        className="admin-input"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-label">Title</label>
                      <input
                        type="text"
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
              <h4 className="admin-section-card-title">Complete The Look (Bundle Cross-Sells)</h4>
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

        {/* 6. TAB 5: ACCORDIONS & SIZE MATRIX */}
        {activeTab === "accordions" && (
          <div className="admin-tab-panel">
            <div className="admin-section-card">
              <h4 className="admin-section-card-title">Technical Accordions</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div className="admin-form-group">
                  <label className="admin-label">1. Silhouette Specification & Tailoring (One bullet per line)</label>
                  <textarea
                    rows="6"
                    value={Array.isArray(accordions.silhouette) ? accordions.silhouette.join("\n") : accordions.silhouette}
                    onChange={(e) => handleAccordionChange("silhouette", e.target.value.split("\n"))}
                    className="admin-textarea"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">2. Air Logistics, Tracking & Dispatch</label>
                  <textarea
                    rows="3"
                    value={accordions.logistics || ""}
                    onChange={(e) => handleAccordionChange("logistics", e.target.value)}
                    className="admin-textarea"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">3. Fabric Care Protocol & Longevity</label>
                  <textarea
                    rows="3"
                    value={accordions.care || ""}
                    onChange={(e) => handleAccordionChange("care", e.target.value)}
                    className="admin-textarea"
                  />
                </div>
              </div>
            </div>

            <div className="admin-section-card">
              <h4 className="admin-section-card-title">Size Guide Measurement Matrix</h4>
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

        {/* Modal Bottom Actions */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", borderTop: "1px solid #e4e4e7", paddingTop: "18px" }}>
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
                  padding: "8px 16px",
                  borderRadius: "5px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                ← Previous
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
                  padding: "8px 16px",
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

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                background: "#f4f4f5",
                color: "#111111",
                border: "1px solid #d4d4d8",
                padding: "10px 20px",
                borderRadius: "5px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                background: "#000000",
                color: "#ffffff",
                border: "none",
                padding: "10px 24px",
                borderRadius: "5px",
                fontSize: "13px",
                fontWeight: "750",
                textTransform: "uppercase",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? "Saving..." : "Save Changes ✓"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
