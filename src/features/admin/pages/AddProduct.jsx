import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminProducts, saveAdminProducts, addAdminLog } from "../data/mockDb";

export default function AddProduct() {
  const navigate = useNavigate();

  // Product Fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [category, setCategory] = useState("Skincare");
  const [gender, setGender] = useState("Unisex");
  const [brand, setBrand] = useState("");
  // Variants Array
  const [variants, setVariants] = useState([
    { id: "v_init_1", sku: "", size: "", color: "", price: "", stock: 0, files: [] }
  ]);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleAddVariantRow = () => {
    setVariants([
      ...variants,
      { id: "v_temp_" + Date.now() + Math.random(), sku: "", size: "", color: "", price: "", stock: 0, files: [] }
    ]);
  };

  const handleRemoveVariantRow = (id) => {
    if (variants.length === 1) {
      setErrorMsg("A product must contain at least one variant configuration.");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }
    setVariants(variants.filter((v) => v.id !== id));
  };

  const handleVariantChange = (id, field, value) => {
    setVariants(
      variants.map((v) => {
        if (v.id === id) {
          return { ...v, [field]: value };
        }
        return v;
      })
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validations
    if (!name.trim()) return setErrorMsg("Product Name is required.");
    if (variants.some((v) => !v.sku.trim())) return setErrorMsg("Each variant must possess a unique SKU.");

    const priceVal = parseFloat(basePrice) || 0;
    const newProductId = "p_" + Date.now();

    // Map variant objects
    const finalVariants = variants.map((v, index) => {
      const variantStock = parseInt(v.stock) || 0;
      const variantPrice = parseFloat(v.price) || priceVal;

      return {
        id: `v_${Date.now()}_${index}`,
        sku: v.sku.trim().toUpperCase(),
        size: v.size.trim() || null,
        color: v.color.trim() || null,
        stock: variantStock,
        price: variantPrice,
        imageCount: v.files?.length || 0,
        status: "active"
      };
    });

    const newProduct = {
      id: newProductId,
      name: name.trim(),
      description: description.trim(),
      price: priceVal,
      category,
      brand: brand.trim() || null,
      gender,
      variants: finalVariants
    };

    // Insert Product into mockDb
    const currentProducts = getAdminProducts();
    const updatedProducts = [...currentProducts, newProduct];
    saveAdminProducts(updatedProducts);

    // Insert Initial Inventory Logs for stocked variants
    finalVariants.forEach((v) => {
      if (v.stock > 0) {
        addAdminLog({
          variantSku: v.sku,
          type: "in",
          quantity: v.stock,
          reason: "Initial stock allocation"
        });
      }
    });

    setSuccessMsg("Product successfully added to the catalog!");
    setErrorMsg("");

    setTimeout(() => {
      navigate("/admin/inventory");
    }, 1500);
  };

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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-input"
              style={{ fontFamily: "Inter, sans-serif", resize: "vertical" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
            <div className="form-group">
              <label className="form-label">Base Price (INR) *</label>
              <input
                type="number"
                placeholder="₹ Price"
                required
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-input"
                style={{ height: "46px" }}
              >
                <option value="Skincare">Skincare</option>
                <option value="Body Care">Body Care</option>
                <option value="Hair Care">Hair Care</option>
                <option value="Men Grooming">Men Grooming</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Brand</label>
              <input
                type="text"
                placeholder="e.g. Osmaki, Dior"
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
              onChange={(e) => setGender(e.target.value)}
              className="form-input"
              style={{ height: "46px" }}
            >
              <option value="Unisex">Unisex</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
            </select>
          </div>

          {/* Variants section */}
          <div className="variant-builder-section">
            <div className="variant-builder-header">
              <h3 style={{ margin: 0, fontFamily: "Inter", fontSize: "14px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Product Variants
              </h3>
              <button type="button" onClick={handleAddVariantRow} className="btn-add-variant">
                + Add Variant Row
              </button>
            </div>

            {/* Column Label Headers */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 0.8fr 0.8fr 1fr 1fr 1.8fr 40px",
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
                  value={v.sku}
                  onChange={(e) => handleVariantChange(v.id, "sku", e.target.value)}
                  className="form-input"
                  style={{ padding: "8px 12px", fontSize: "13px" }}
                />
                <input
                  type="text"
                  placeholder="e.g. 100ml"
                  value={v.size}
                  onChange={(e) => handleVariantChange(v.id, "size", e.target.value)}
                  className="form-input"
                  style={{ padding: "8px 12px", fontSize: "13px" }}
                />
                <input
                  type="text"
                  placeholder="e.g. Amber"
                  value={v.color}
                  onChange={(e) => handleVariantChange(v.id, "color", e.target.value)}
                  className="form-input"
                  style={{ padding: "8px 12px", fontSize: "13px" }}
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={v.price}
                  onChange={(e) => handleVariantChange(v.id, "price", e.target.value)}
                  className="form-input"
                  style={{ padding: "8px 12px", fontSize: "13px" }}
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Stock"
                  value={v.stock}
                  onChange={(e) => handleVariantChange(v.id, "stock", parseInt(e.target.value) || 0)}
                  className="form-input"
                  style={{ padding: "8px 12px", fontSize: "13px" }}
                />
                <label className="btn-file-upload">
                  <input
                    type="file"
                    multiple
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
                  onClick={() => handleRemoveVariantRow(v.id)}
                  className="btn-delete-row"
                  title="Remove variant"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          <button type="submit" className="form-submit-btn">
            Create Product Listing
          </button>
        </div>
      </form>
    </div>
  );
}
