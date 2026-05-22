import { useState, useEffect } from "react";
import { getAdminProducts, saveAdminProducts, addAdminLog } from "../data/mockDb";

export default function InventoryManager() {
  const [products, setProducts] = useState([]);
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  // Modal Adjustment State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adjustTarget, setAdjustTarget] = useState(null); // { productId, variantId, sku, currentStock, changeType } (+1 or -1)
  const [adjustReason, setAdjustReason] = useState("Inventory count adjustment");
  const [adjustQuantity, setAdjustQuantity] = useState(1);

  useEffect(() => {
    setProducts(getAdminProducts());
  }, []);

  const toggleExpand = (productId) => {
    if (expandedProductId === productId) {
      setExpandedProductId(null);
    } else {
      setExpandedProductId(productId);
    }
  };

  // Trigger quick increment/decrement adjustment flow
  const openAdjustmentModal = (productId, variantId, sku, currentStock, changeDirection) => {
    setAdjustTarget({ productId, variantId, sku, currentStock, changeDirection });
    setAdjustQuantity(1);
    setAdjustReason(changeDirection === "up" ? "Restock replenishment" : "Damaged inventory discard");
    setIsModalOpen(true);
  };

  const handleAdjustSubmit = (e) => {
    e.preventDefault();
    if (!adjustTarget) return;

    const { productId, variantId, sku, currentStock, changeDirection } = adjustTarget;
    const finalChange = changeDirection === "up" ? adjustQuantity : -adjustQuantity;
    const newStock = Math.max(0, currentStock + finalChange);

    // Update product list state
    const updatedProducts = products.map((product) => {
      if (product.id === productId) {
        return {
          ...product,
          variants: product.variants.map((v) => {
            if (v.id === variantId) {
              return { ...v, stock: newStock };
            }
            return v;
          })
        };
      }
      return product;
    });

    setProducts(updatedProducts);
    saveAdminProducts(updatedProducts);

    // Write log entry
    addAdminLog({
      variantSku: sku,
      type: changeDirection === "up" ? "in" : "out",
      quantity: finalChange,
      reason: adjustReason
    });

    setIsModalOpen(false);
    setAdjustTarget(null);
  };

  // Filter Categories list
  const categories = ["All", ...new Set(products.map((p) => p.category))];

  // Filtered Products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.variants.some((v) => v.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === "All" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-header-title">Stock & Inventory Manager</h1>
        <div style={{ display: "flex", gap: "12px" }}>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="form-input"
            style={{ height: "42px", padding: "0 12px", border: "1px solid #d1d5db", borderRadius: "8px" }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search products or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ width: "240px", height: "42px", padding: "0 16px" }}
          />
        </div>
      </div>

      <div className="admin-card" style={{ padding: "0" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: "40px" }}></th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price Interval</th>
              <th>Variants Count</th>
              <th>Total Units</th>
              <th>Catalog Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "30px", color: "#666" }}>
                  No matching products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => {
                const totalUnits = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
                const minPrice = product.variants?.reduce((min, v) => v.price < min ? v.price : min, product.variants[0]?.price) || 0;
                const maxPrice = product.variants?.reduce((max, v) => v.price > max ? v.price : max, product.variants[0]?.price) || 0;
                const isExpanded = expandedProductId === product.id;
                const outOfStock = product.variants?.some((v) => v.stock === 0);

                return (
                  <>
                    <tr
                      key={product.id}
                      onClick={() => toggleExpand(product.id)}
                      className="expandable-row"
                    >
                      <td>
                        <span style={{ transition: "transform 0.2s", display: "inline-block", transform: isExpanded ? "rotate(90deg)" : "rotate(0)" }}>
                          ▶
                        </span>
                      </td>
                      <td>
                        <strong>{product.name}</strong>
                      </td>
                      <td>{product.category}</td>
                      <td>
                        {minPrice === maxPrice ? `₹${minPrice}` : `₹${minPrice} - ₹${maxPrice}`}
                      </td>
                      <td>{product.variants?.length || 0} variants</td>
                      <td>{totalUnits} units</td>
                      <td>
                        {outOfStock ? (
                          <span className="badge badge-warning">Needs Restock</span>
                        ) : (
                          <span className="badge badge-success">Fully Active</span>
                        )}
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="variants-dropdown-row">
                        <td colSpan="7">
                          <div className="variants-table-container">
                            <table className="variants-table">
                              <thead>
                                <tr>
                                  <th>SKU</th>
                                  <th>Size</th>
                                  <th>Color</th>
                                  <th>Price</th>
                                  <th>Current Stock</th>
                                  <th style={{ width: "160px" }}>Stock Adjustment</th>
                                </tr>
                              </thead>
                              <tbody>
                                {product.variants?.map((variant) => (
                                  <tr key={variant.id}>
                                    <td><code>{variant.sku}</code></td>
                                    <td>{variant.size || "-"}</td>
                                    <td>{variant.color || "-"}</td>
                                    <td>₹{variant.price}</td>
                                    <td>
                                      <span
                                        style={{
                                          fontWeight: "bold",
                                          color: variant.stock === 0 ? "#dc2626" : variant.stock <= 10 ? "#d97706" : "inherit"
                                        }}
                                      >
                                        {variant.stock} units
                                      </span>
                                    </td>
                                    <td>
                                      <div className="stock-adjust-cell">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            openAdjustmentModal(product.id, variant.id, variant.sku, variant.stock, "down");
                                          }}
                                          className="adjust-btn"
                                          disabled={variant.stock === 0}
                                          style={{ opacity: variant.stock === 0 ? 0.5 : 1 }}
                                        >
                                          -
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            openAdjustmentModal(product.id, variant.id, variant.sku, variant.stock, "up");
                                          }}
                                          className="adjust-btn"
                                        >
                                          +
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Adjustment Overlay Modal */}
      {isModalOpen && adjustTarget && (
        <div className="modal-overlay">
          <form onSubmit={handleAdjustSubmit} className="modal-content">
            <h3 className="modal-title">Inventory Stock Adjustment</h3>
            <div className="modal-subtitle">
              SKU: <strong>{adjustTarget.sku}</strong> (Current Stock: {adjustTarget.currentStock} units)
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Adjustment Quantity</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustQuantity}
                  onChange={(e) => setAdjustQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Reason for movement</label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="form-input"
                  style={{ height: "46px" }}
                >
                  {adjustTarget.changeDirection === "up" ? (
                    <>
                      <option value="Restock replenishment">Restock replenishment</option>
                      <option value="Returned items replacement">Returned items replacement</option>
                      <option value="Inventory count adjustment">Inventory count adjustment</option>
                    </>
                  ) : (
                    <>
                      <option value="Damaged inventory discard">Damaged inventory discard</option>
                      <option value="Customer purchase order">Customer purchase order</option>
                      <option value="Theft or loss adjustment">Theft or loss adjustment</option>
                      <option value="Inventory count adjustment">Inventory count adjustment</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn-cancel">
                Cancel
              </button>
              <button type="submit" className="btn-submit">
                Apply Change
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
