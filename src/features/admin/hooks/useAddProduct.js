import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import categoryApi from "../api/categoryApi";
import productApi from "../api/productApi";
import productService from "../services/productService";
import {
  DEFAULT_TECH_FEATURES,
  DEFAULT_MACRO_TILES,
  DEFAULT_ACCORDIONS,
  DEFAULT_SIZE_GUIDE,
} from "../data/defaultEditorialSpecs";

export function useAddProduct() {
  const navigate = useNavigate();

  // Active Tab state: 'basics' | 'variants' | 'specs' | 'tiles' | 'accordions'
  const [activeTab, setActiveTab] = useState("basics");

  // Categories & Catalog Products
  const [categories, setCategories] = useState([]);
  const [catalogProducts, setCatalogProducts] = useState([]);

  // Tab 1: Basics & Pricing
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("Washed Onyx Black • Dropped Shoulder Silhouette • Pre-Shrunk Luxury Fit");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [gender, setGender] = useState("Unisex");
  const [brand, setBrand] = useState("OSMAKI");

  // Promotional Toggles
  const [isTrending, setIsTrending] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);

  // Tab 2: Variants Array
  const [variants, setVariants] = useState([
    { id: "v_init_1", sku: "OSM-240G-OVT-BLK", size: "L", color: "Black", price: "", discountPrice: "", stock: 100, files: [] }
  ]);

  // Tab 3: Specs & Fabric Details
  const [edition, setEdition] = useState("EDITION 01 // CORE ESSENTIALS");
  const [fabricGsm, setFabricGsm] = useState("240 GSM INTERLOCK");
  const [badgeLabel, setBadgeLabel] = useState("20% OFF ARCHIVE");
  const [batchLabel, setBatchLabel] = useState("BATCH 01 / ESSENTIALS");
  const [modelSpec, setModelSpec] = useState("MODEL SPEC: 6'1\" (185 CM) / 78 KG — WEARS SIZE L");
  const [fitNote, setFitNote] = useState("Boxy silhouette. True-to-size gives the intended dramatic drape; size down for standard tailored fit.");
  const [techFeatures, setTechFeatures] = useState(DEFAULT_TECH_FEATURES);

  // Tab 4: Macro Tiles & Cross-Sells
  const [macroTiles, setMacroTiles] = useState(DEFAULT_MACRO_TILES);
  const [bundleIds, setBundleIds] = useState([]);

  // Tab 5: Accordions & Size Guide
  const [accordions, setAccordions] = useState(DEFAULT_ACCORDIONS);
  const [sizeGuide, setSizeGuide] = useState(DEFAULT_SIZE_GUIDE);

  // Status & Notifications
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories and catalog products for cross-sell bundles on mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [catList, prodList] = await Promise.allSettled([
          categoryApi.getCategories(),
          productApi.getProducts(),
        ]);

        if (catList.status === "fulfilled" && Array.isArray(catList.value)) {
          setCategories(catList.value);
          if (catList.value.length > 0) {
            setCategoryId(catList.value[0].id);
          }
        }

        if (prodList.status === "fulfilled" && Array.isArray(prodList.value)) {
          setCatalogProducts(prodList.value);
        }
      } catch (err) {
        console.error("Failed to load initial data in useAddProduct:", err);
      }
    }
    loadInitialData();
  }, []);

  // Variant Helpers
  const handleAddVariantRow = () => {
    setVariants([
      ...variants,
      { id: "v_temp_" + Date.now() + Math.random(), sku: "", size: "", color: "", price: "", discountPrice: "", stock: 0, files: [] }
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

  // Bundle Cross-Sell Helpers
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

    if (!name.trim()) {
      setActiveTab("basics");
      return setErrorMsg("Product Name is required.");
    }
    if (variants.some((v) => !v.sku.trim())) {
      setActiveTab("variants");
      return setErrorMsg("Each variant must possess a unique SKU.");
    }

    try {
      setIsSubmitting(true);
      setErrorMsg("");
      setSuccessMsg("");

      const productForm = {
        name,
        subtitle,
        description,
        basePrice,
        discountPrice,
        categoryId,
        gender,
        brand,
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
      };

      await productService.saveProduct(productForm, variants);

      setSuccessMsg("Architectural garment successfully published with dynamic specifications!");
      setTimeout(() => {
        navigate("/admin/inventory");
      }, 1500);
    } catch (err) {
      console.error("Error creating product:", err);
      setErrorMsg(err.message || "Failed to create product listing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    categories,
    catalogProducts,
    name,
    setName,
    subtitle,
    setSubtitle,
    description,
    setDescription,
    basePrice,
    setBasePrice,
    discountPrice,
    setDiscountPrice,
    categoryId,
    setCategoryId,
    gender,
    setGender,
    brand,
    setBrand,
    variants,
    isTrending,
    setIsTrending,
    isFeatured,
    setIsFeatured,
    isBestSeller,
    setIsBestSeller,
    edition,
    setEdition,
    fabricGsm,
    setFabricGsm,
    badgeLabel,
    setBadgeLabel,
    batchLabel,
    setBatchLabel,
    modelSpec,
    setModelSpec,
    fitNote,
    setFitNote,
    techFeatures,
    macroTiles,
    accordions,
    sizeGuide,
    bundleIds,
    handleAddVariantRow,
    handleRemoveVariantRow,
    handleVariantChange,
    handleTechFeatureChange,
    handleMacroTileChange,
    handleSizeGuideChange,
    handleAccordionChange,
    handleToggleBundleId,
    handleSubmit,
    errorMsg,
    successMsg,
    isSubmitting,
  };
}

export default useAddProduct;
