import React, { useState, useEffect } from "react";
import categoryApi from "../api/categoryApi";
import productApi from "../api/productApi";

export default function EditProductModal({ isOpen, product, onClose, onSave }) {
  const [categories, setCategories] = useState([]);
  
  // Product details
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [gender, setGender] = useState("Unisex");
  const [brand, setBrand] = useState("");

  const [variants, setVariants] = useState([]);
  
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Promotion Toggles
  const [isTrending, setIsTrending] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const list = await categoryApi.getCategories();
        if (Array.isArray(list)) {
          setCategories(list);
        }
      } catch (err) {
        console.error("Failed to load categories in Edit modal:", err);
      }
    }
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  // Sync state with product prop when modal opens
  useEffect(() => {
    if (product && isOpen) {
      setName(product.name || "");
      setDescription(product.description || "");
      setBasePrice(product.price || "");
      setDiscountPrice(product.discountPrice || "");
      setCategoryId(product.categoryId || "");
      setGender(product.gender || "Unisex");
      setBrand(product.brand || "");
      
      // Sync promotions
      setIsTrending(product.isTrending || false);
      setIsFeatured(product.isFeatured || false);
      setIsBestSeller(product.isBestSeller || false);
      
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
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleAddVariantRow = () => {
    setVariants([
      ...variants,
      {
        id: null, // null for new variant
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
    setVariants(
      variants.map((v, idx) => {
        if (idx === index) {
          return { ...v, [field]: value };
        }
        return v;
      })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return setErrorMsg("Product Name is required.");
    if (variants.some((v) => !v.sku.trim())) return setErrorMsg("Each variant must possess a SKU.");

    try {
      setIsSubmitting(true);
      setErrorMsg("");

      const processedVariants = [];

      // Sequentially upload images for variants that have new files
      for (const variant of variants) {
        let currentUrls = [...variant.imageUrls];

        if (variant.files && variant.files.length > 0) {
          // If new files are uploaded, let's upload them and use those URLs
          const uploadedUrls = [];
          for (const file of variant.files) {
            try {
              const url = await productApi.uploadImage(file);
              if (url) uploadedUrls.push(url);
            } catch (err) {
              console.error("Failed to upload image during update:", err);
            }
          }
          if (uploadedUrls.length > 0) {
            currentUrls = uploadedUrls; // replace with new uploaded images
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
        description: description?.trim() || "",
        price: parseFloat(basePrice) || 0,
        discountPrice: parseFloat(discountPrice) || null,
        categoryId: categoryId || null,
        gender: gender || "Unisex",
        brand: brand?.trim() || null,
        isTrending,
        isFeatured,
        isBestSeller,
        variants: processedVariants,
      };

      const updatedProduct = await productApi.updateProduct(product.id, payload);
      onSave(updatedProduct);
    } catch (err) {
      console.error("Error updating product:", err);
      setErrorMsg(err.message || "Failed to update product listing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <form
        onSubmit={handleSubmit}
        className="modal-content"
        style={{
          maxWidth: "850px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h3 className="modal-title">Edit Product</h3>
        <p className="modal-subtitle" style={{ marginBottom: "16px" }}>
          Update the product information and variant allocations.
        </p>

        {errorMsg && (
          <div
            style={{
              padding: "12px 18px",
              backgroundColor: "#fef2f2",
              color: "#dc2626",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            ⚠️ {errorMsg}
          </div>
        )}

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input
              type="text"
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
                <option value="">-- Select Category --</option>
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
          <div className="variant-builder-section" style={{ marginTop: "16px" }}>
            <div className="variant-builder-header">
              <h3
                style={{
                  margin: 0,
                  fontFamily: "Inter",
                  fontSize: "14px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
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
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 0.8fr 0.8fr 1fr 1fr 1fr 1.8fr 40px",
                gap: "12px",
                padding: "0 16px 8px 16px",
                fontSize: "11px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                color: "#666",
                textAlign: "left",
              }}
            >
              <div>SKU *</div>
              <div>Size</div>
              <div>Color</div>
              <div>Price</div>
              <div>Discount</div>
              <div>Stock</div>
              <div>Images</div>
              <div></div>
            </div>

            {variants.map((v, index) => (
              <div key={index} className="variant-builder-row">
                <input
                  type="text"
                  placeholder="SKU"
                  required
                  disabled={isSubmitting}
                  value={v.sku}
                  onChange={(e) => handleVariantChange(index, "sku", e.target.value)}
                  className="form-input"
                  style={{ padding: "8px 12px", fontSize: "13px" }}
                />
                <input
                  type="text"
                  placeholder="Size"
                  disabled={isSubmitting}
                  value={v.size}
                  onChange={(e) => handleVariantChange(index, "size", e.target.value)}
                  className="form-input"
                  style={{ padding: "8px 12px", fontSize: "13px" }}
                />
                <input
                  type="text"
                  placeholder="Color"
                  disabled={isSubmitting}
                  value={v.color}
                  onChange={(e) => handleVariantChange(index, "color", e.target.value)}
                  className="form-input"
                  style={{ padding: "8px 12px", fontSize: "13px" }}
                />
                <input
                  type="number"
                  placeholder="Price"
                  disabled={isSubmitting}
                  value={v.price}
                  onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                  className="form-input"
                  style={{ padding: "8px 12px", fontSize: "13px" }}
                />
                <input
                  type="number"
                  placeholder="Discount"
                  disabled={isSubmitting}
                  value={v.discountPrice}
                  onChange={(e) => handleVariantChange(index, "discountPrice", e.target.value)}
                  className="form-input"
                  style={{ padding: "8px 12px", fontSize: "13px" }}
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Stock"
                  disabled={isSubmitting}
                  value={v.stock}
                  onChange={(e) => handleVariantChange(index, "stock", parseInt(e.target.value) || 0)}
                  className="form-input"
                  style={{ padding: "8px 12px", fontSize: "13px" }}
                />
                <label
                  className="btn-file-upload"
                  style={{
                    opacity: isSubmitting ? 0.6 : 1,
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                  }}
                >
                  <input
                    type="file"
                    multiple
                    disabled={isSubmitting}
                    accept="image/*"
                    onChange={(e) =>
                      handleVariantChange(index, "files", Array.from(e.target.files))
                    }
                    style={{ display: "none" }}
                  />
                  <span
                    style={{
                      fontSize: "12px",
                      color:
                        v.files?.length > 0
                          ? "#047857"
                          : v.imageUrls?.length > 0
                          ? "#111"
                          : "#666",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      padding: "0 8px",
                    }}
                  >
                    {v.files?.length > 0
                      ? `New Selected (${v.files.length})`
                      : v.imageUrls?.length > 0
                      ? `Has Images (${v.imageUrls.length})`
                      : "Upload Images"}
                  </span>
                </label>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleRemoveVariantRow(index)}
                  className="btn-delete-row"
                  title="Remove variant"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            onClick={onClose}
            className="btn-cancel"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-submit"
            disabled={isSubmitting}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {isSubmitting ? (
              <>
                <div
                  className="loader-spinner"
                  style={{
                    width: "16px",
                    height: "16px",
                    borderWidth: "2px",
                    borderColor: "#fff",
                    borderTopColor: "transparent",
                    margin: 0,
                  }}
                ></div>
                <span>Saving...</span>
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
