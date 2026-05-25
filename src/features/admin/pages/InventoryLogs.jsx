import React, { useState } from "react";
import useInventoryLogs from "../hooks/useInventoryLogs";

export default function InventoryLogs() {
  const { logs, loading, error } = useInventoryLogs();
  const [filterType, setFilterType] = useState("All");

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
        <div className="loader-spinner" style={{ margin: "0 auto" }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", color: "#dc2626", backgroundColor: "#fef2f2", borderRadius: "8px" }}>
        ⚠️ {error}
      </div>
    );
  }

  const filteredLogs = logs.filter((log) => {
    if (filterType === "All") return true;
    return log.type === filterType;
  });

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-header-title">Inventory Activity Audit Logs</h1>
        <div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="form-input"
            style={{ height: "42px", padding: "0 12px", border: "1px solid #d1d5db", borderRadius: "8px" }}
          >
            <option value="All">All Operations</option>
            <option value="in">Inbound (Stock Added)</option>
            <option value="out">Outbound (Stock Removed)</option>
            <option value="adjustment">Stock Adjustments</option>
          </select>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-title">Chronological Stock Timeline</div>

        <div className="logs-timeline">
          {filteredLogs.length === 0 ? (
            <p style={{ color: "#666", fontSize: "14px", padding: "20px 0" }}>
              No inventory movements matching this criteria.
            </p>
          ) : (
            filteredLogs.map((log) => {
              const isPositive = log.type === "in" || (log.type === "adjustment" && log.quantity > 0);
              const isNegative = log.type === "out" || (log.type === "adjustment" && log.quantity < 0);

              let iconBg = "#f3f4f6";
              let iconChar = "🔧";
              if (log.type === "in") {
                iconBg = "#ecfdf5";
                iconChar = "📥";
              } else if (log.type === "out") {
                iconBg = "#fef2f2";
                iconChar = "📤";
              }

              return (
                <div key={log.id} className="log-item">
                  <div className="log-icon-wrapper" style={{ backgroundColor: iconBg }}>
                    <span style={{ fontSize: "18px" }}>{iconChar}</span>
                  </div>

                  <div className="log-details">
                    <div className="log-meta">
                      <div className="log-variant-sku">SKU: {log.variantSku}</div>
                      <div className="log-reason">{log.reason}</div>
                      <div className="log-timestamp">
                        {new Date(log.createdAt).toLocaleString([], {
                          dateStyle: "medium",
                          timeStyle: "short"
                        })}
                      </div>
                    </div>

                    <div
                      className={`log-qty-badge ${
                        isPositive ? "positive" : isNegative ? "negative" : ""
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {log.quantity} units
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
