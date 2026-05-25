import React from "react";
import SectionTable from "../components/SectionTable";
import SectionFormModal from "../components/SectionFormModal";
import useSectionManager from "../hooks/useSectionManager";
import "../styles/admin.css";

export default function SectionManager() {
  const {
    sections,
    products,
    loading,
    errorMsg,
    successMsg,
    isFormOpen,
    editingSection,
    isSubmitting,
    handleToggleActive,
    handleDelete,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseForm,
    handleSubmit,
  } = useSectionManager();

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      <div className="admin-header">
        <h1 className="admin-header-title">Page Banner & Section Manager</h1>
        <button
          onClick={handleOpenAdd}
          className="btn-add-variant"
          style={{ fontSize: "14px", height: "42px", padding: "0 24px" }}
        >
          + Add Page Section
        </button>
      </div>

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

      {successMsg && (
        <div
          style={{
            padding: "12px 18px",
            backgroundColor: "#ecfdf5",
            color: "#047857",
            borderRadius: "8px",
            marginBottom: "20px",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          ✓ {successMsg}
        </div>
      )}

      <SectionTable
        sections={sections}
        products={products}
        loading={loading}
        onToggleActive={handleToggleActive}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      <SectionFormModal
        isOpen={isFormOpen}
        section={editingSection}
        products={products}
        isSubmitting={isSubmitting}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
