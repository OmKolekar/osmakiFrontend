import { useState, useEffect, useMemo } from "react";
import productApi from "../api/productApi";

export function useInventoryManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [expandedProductId, setExpandedProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  // Modal Adjustment State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adjustTarget, setAdjustTarget] = useState(null); // { productId, variantId, sku, currentStock, changeDirection }
  const [adjustReason, setAdjustReason] = useState("Inventory count adjustment");
  const [adjustQuantity, setAdjustQuantity] = useState(1);
  const [adjusting, setAdjusting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await productApi.getProducts();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (err) {
      console.error("Failed to load admin products:", err);
      setError("Failed to load products from database.");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (productId) => {
    setExpandedProductId((prev) => (prev === productId ? null : productId));
  };

  const openAdjustmentModal = (productId, variantId, sku, currentStock, changeDirection) => {
    setAdjustTarget({ productId, variantId, sku, currentStock, changeDirection });
    setAdjustQuantity(1);
    setAdjustReason(changeDirection === "up" ? "Restock replenishment" : "Damaged inventory discard");
    setIsModalOpen(true);
  };

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    if (!adjustTarget) return;

    const { productId, variantId, sku, currentStock, changeDirection } = adjustTarget;
    const type = changeDirection === "up" ? "in" : "out";

    try {
      setAdjusting(true);
      const res = await productApi.adjustVariantStock(variantId, {
        quantity: adjustQuantity,
        reason: adjustReason,
        type,
      });

      if (res && typeof res.newStock === "number") {
        // Update product state locally
        setProducts((prevProducts) =>
          prevProducts.map((p) => {
            if (p.id === productId) {
              return {
                ...p,
                variants: p.variants.map((v) => {
                  if (v.id === variantId) {
                    return { ...v, stock: res.newStock };
                  }
                  return v;
                }),
              };
            }
            return p;
          })
        );
      } else {
        // Fallback to reload
        await fetchProducts();
      }

      setIsModalOpen(false);
      setAdjustTarget(null);
    } catch (err) {
      console.error("Error adjusting stock:", err);
      alert(err.message || "Failed to update inventory level.");
    } finally {
      setAdjusting(false);
    }
  };

  // Memoized categories list derived dynamically
  const categories = useMemo(() => {
    const list = new Set();
    products.forEach((p) => {
      const catName = p.category ? p.category.name : "Uncategorized";
      list.add(catName);
    });
    return ["All", ...list];
  }, [products]);

  // Memoized filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.variants.some((v) => v.sku.toLowerCase().includes(searchTerm.toLowerCase()));

      const catName = product.category ? product.category.name : "Uncategorized";
      const matchesCategory = filterCategory === "All" || catName === filterCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, filterCategory]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    expandedProductId,
    toggleExpand,
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    isModalOpen,
    setIsModalOpen,
    adjustTarget,
    adjustReason,
    setAdjustReason,
    adjustQuantity,
    setAdjustQuantity,
    adjusting,
    handleAdjustSubmit,
    categories,
    filteredProducts,
  };
}

export default useInventoryManager;
