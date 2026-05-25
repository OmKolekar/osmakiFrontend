import React from "react";

export default function SectionTable({
  sections,
  products,
  loading,
  onToggleActive,
  onEdit,
  onDelete,
}) {
  return (
    <div className="admin-card" style={{ padding: "0", overflow: "hidden" }}>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Preview</th>
            <th>Section Type</th>
            <th>Page</th>
            <th>Title</th>
            <th>Redirect Target</th>
            <th>Order</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", padding: "40px" }}>
                <div className="loader-spinner" style={{ margin: "0 auto" }}></div>
              </td>
            </tr>
          ) : sections.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", padding: "40px", color: "#666" }}>
                No page sections defined. Click "+ Add Page Section" to create one.
              </td>
            </tr>
          ) : (
            sections.map((section) => {
              const targetedProduct =
                section.targetType === "product"
                  ? products.find((p) => p.id === section.targetId)
                  : null;

              return (
                <tr key={section.id}>
                  <td>
                    {section.desktopImage ? (
                      <img
                        src={section.desktopImage}
                        alt={section.imageAltText || "preview"}
                        style={{
                          width: "80px",
                          height: "45px",
                          objectFit: "cover",
                          borderRadius: "4px",
                          border: "1px solid #ddd",
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: "12px", color: "#999" }}>No image</span>
                    )}
                  </td>
                  <td>
                    <span className="badge" style={{ backgroundColor: "#f1f1f1", color: "#333" }}>
                      {section.sectionType}
                    </span>
                  </td>
                  <td>
                    <code>{section.page}</code>
                  </td>
                  <td>
                    <strong>{section.title || "-"}</strong>
                    {section.subtitle && (
                      <div style={{ fontSize: "11px", color: "#777", marginTop: "2px" }}>
                        {section.subtitle}
                      </div>
                    )}
                  </td>
                  <td>
                    {section.targetType === "product" && (
                      <span style={{ fontSize: "12.5px" }}>
                        📦 Product: <code>{targetedProduct ? targetedProduct.name : section.targetId}</code>
                      </span>
                    )}
                    {section.targetType === "category" && (
                      <span style={{ fontSize: "12.5px" }}>📁 Category Link</span>
                    )}
                    {(section.targetType === "custom" || section.targetType === "external") && (
                      <span style={{ fontSize: "12.5px" }}>
                        🔗 Link:{" "}
                        <a
                          href={section.targetUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "#3b82f6" }}
                        >
                          {section.targetUrl}
                        </a>
                      </span>
                    )}
                    {(!section.targetType || section.targetType === "none") && (
                      <span style={{ color: "#999" }}>None</span>
                    )}
                  </td>
                  <td>{section.displayOrder}</td>
                  <td>
                    <button
                      onClick={() => onToggleActive(section)}
                      className={`badge ${section.isActive ? "badge-success" : "badge-danger"}`}
                      style={{ border: "none", cursor: "pointer" }}
                    >
                      {section.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={() => onEdit(section)}
                        className="action-link-btn"
                        style={{ textDecoration: "none", color: "#2563eb" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(section.id)}
                        className="action-link-btn"
                        style={{ textDecoration: "none", color: "#dc2626" }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
