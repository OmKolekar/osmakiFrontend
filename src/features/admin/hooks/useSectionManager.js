import { useState, useEffect } from "react";
import sectionApi from "../api/sectionApi";
import productApi from "../api/productApi";
import sectionService from "../services/sectionService";

export function useSectionManager() {
  const [sections, setSections] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Modal and Submission States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSections();
    fetchProducts();
  }, []);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const data = await sectionApi.getSections();
      if (Array.isArray(data)) {
        setSections(data);
      }
    } catch (err) {
      console.error("Failed to load sections:", err);
      setErrorMsg("Failed to load page sections.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await productApi.getProducts();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (err) {
      console.error("Failed to load products for targeting:", err);
    }
  };

  const handleToggleActive = async (section) => {
    try {
      await sectionApi.updateSection(section.id, {
        isActive: !section.isActive,
      });
      fetchSections();
    } catch (err) {
      console.error("Failed to update status:", err);
      setErrorMsg("Failed to update section status.");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this page section?")) return;
    try {
      await sectionApi.deleteSection(id);
      setSuccessMsg("Page section deleted successfully!");
      fetchSections();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Failed to delete page section:", err);
      setErrorMsg("Failed to delete page section.");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  const handleOpenAdd = () => {
    setEditingSection(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (section) => {
    setEditingSection(section);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingSection(null);
  };

  const handleSubmit = async (sectionData, files) => {
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await sectionService.saveSection(
        sectionData,
        files,
        editingSection ? editingSection.id : null
      );
      
      setSuccessMsg(
        editingSection
          ? "Page section updated successfully!"
          : "Page section created successfully!"
      );
      setIsFormOpen(false);
      fetchSections();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Error saving page section:", err);
      setErrorMsg(err.message || "Failed to save page section.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
  };
}
export default useSectionManager;
