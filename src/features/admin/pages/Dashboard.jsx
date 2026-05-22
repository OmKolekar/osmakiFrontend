import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAdminProducts, getAdminLogs } from "../data/mockDb";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    setProducts(getAdminProducts());
    setLogs(getAdminLogs());
  }, []);

  // Compute metrics
  let totalProductsCount = products.length;
  let totalStock = 0;
  let totalValue = 0;
  let lowStockVariants = [];
  let outOfStockVariants = [];

  products.forEach((product) => {
    product.variants?.forEach((variant) => {
      totalStock += variant.stock;
      totalValue += variant.stock * variant.price;

      if (variant.stock === 0) {
        outOfStockVariants.push({
          productName: product.name,
          ...variant
        });
      } else if (variant.stock > 0 && variant.stock <= 10) {
        lowStockVariants.push({
          productName: product.name,
          ...variant
        });
      }
    });
  });

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-header-title">Overview Dashboard</h1>
        <div style={{ color: "#666", fontSize: "14px", fontFamily: "Inter, sans-serif" }}>
          Inventory Health Status: <strong style={{ color: outOfStockVariants.length > 0 ? "#dc2626" : "#047857" }}>
            {outOfStockVariants.length > 0 ? "Action Required" : "Healthy"}
          </strong>
        </div>
      </div>

      {/* Grid Summary Cards */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-label">Total Catalog Products</div>
          <div className="stat-value">{totalProductsCount}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total Units In Stock</div>
          <div className="stat-value">{totalStock}</div>
        </div>

        <div className="stat-card stat-alert-warning">
          <div className="stat-label" style={{ color: "#d97706" }}>Low Stock Alerts</div>
          <div className="stat-value" style={{ color: "#d97706" }}>{lowStockVariants.length}</div>
        </div>

        <div className="stat-card stat-alert-danger">
          <div className="stat-label" style={{ color: "#dc2626" }}>Out Of Stock</div>
          <div className="stat-value" style={{ color: "#dc2626" }}>{outOfStockVariants.length}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total Valuation (INR)</div>
          <div className="stat-value">₹{totalValue.toLocaleString()}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "30px" }}>
        {/* Action Panel: Low / Out of Stock alerts */}
        <div>
          <div className="admin-card">
            <div className="admin-card-title">Stock Alert Focus List</div>
            {lowStockVariants.length === 0 && outOfStockVariants.length === 0 ? (
              <p style={{ color: "#666", fontSize: "14px" }}>All variants are adequately stocked.</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product & Variant</th>
                    <th>SKU</th>
                    <th>Stock Level</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {outOfStockVariants.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.productName}</strong>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          Size: {item.size} / Color: {item.color}
                        </div>
                      </td>
                      <td><code>{item.sku}</code></td>
                      <td>{item.stock} units</td>
                      <td>
                        <span className="badge badge-danger">Out of Stock</span>
                      </td>
                    </tr>
                  ))}
                  {lowStockVariants.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.productName}</strong>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          Size: {item.size} / Color: {item.color}
                        </div>
                      </td>
                      <td><code>{item.sku}</code></td>
                      <td>{item.stock} units</td>
                      <td>
                        <span className="badge badge-warning">Low Stock</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div style={{ marginTop: "20px" }}>
              <Link to="/admin/inventory" className="action-link-btn">
                Open Stock Manager Grid →
              </Link>
            </div>
          </div>
        </div>

        {/* Side Panel: Recent Stock Events */}
        <div>
          <div className="admin-card">
            <div className="admin-card-title">Recent Inventory Activity</div>
            {logs.length === 0 ? (
              <p style={{ color: "#666", fontSize: "14px" }}>No recent log movements recorded.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {logs.slice(0, 5).map((log) => {
                  const isPositive = log.type === "in" || (log.type === "adjustment" && log.quantity > 0);
                  const isDanger = log.type === "out" || (log.type === "adjustment" && log.quantity < 0);
                  return (
                    <div
                      key={log.id}
                      style={{
                        padding: "12px",
                        border: "1px solid #eaeaea",
                        borderRadius: "8px",
                        backgroundColor: "#fafafa"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <code style={{ fontSize: "12px", fontWeight: "600" }}>{log.variantSku}</code>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: "bold",
                            color: isPositive ? "#047857" : isDanger ? "#dc2626" : "#666",
                            backgroundColor: isPositive ? "#ecfdf5" : isDanger ? "#fef2f2" : "#f3f4f6",
                            padding: "2px 8px",
                            borderRadius: "4px"
                          }}
                        >
                          {isPositive ? "+" : ""}{log.quantity}
                        </span>
                      </div>
                      <div style={{ fontSize: "12px", color: "#555" }}>{log.reason}</div>
                      <div style={{ fontSize: "10px", color: "#999", marginTop: "4px" }}>
                        {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div style={{ marginTop: "20px" }}>
              <Link to="/admin/logs" className="action-link-btn">
                View Full Audit Logs →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
