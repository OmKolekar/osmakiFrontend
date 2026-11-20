import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import categoryApi from "../api/categoryApi";
import productService from "../services/productService";

export function useAddProduct() {
  const navigate = useNavigate();

  // Reference Data
  const [categories, setCategories] = useState([]);

  // Section 1: Basic Identity
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [gender, setGender] = useState("Unisex");
  const [brand, setBrand] = useState("OSMAKI");

  // Section 2: Pricing & Discover Flags
  const [basePrice, setBasePrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [isTrending, setIsTrending] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);

  // Section 3: Variants Array (Standard apparel sizes by default)
  const [variants, setVariants] = useState([
    { id: "v_init_1", sku: "", size: "S", color: "Black", stock: 50, price: "", discountPrice: "", files: [], imageUrls: [] },
    { id: "v_init_2", sku: "", size: "M", color: "Black", stock: 50, price: "", discountPrice: "", files: [], imageUrls: [] },
    { id: "v_init_3", sku: "", size: "L", color: "Black", stock: 50, price: "", discountPrice: "", files: [], imageUrls: [] },
    { id: "v_init_4", sku: "", size: "XL", color: "Black", stock: 50, price: "", discountPrice: "", files: [], imageUrls: [] },
  ]);

  // Notifications
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const catList = await categoryApi.getCategories();
        if (Array.isArray(catList)) {
          setCategories(catList);
          if (catList.length > 0) {
            setCategoryId(catList[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load categories in useAddProduct:", err);
      }
    }
    loadCategories();
  }, []);

  // Variant Helpers
  const handleAddVariantRow = () => {
    setVariants((prev) => [
      ...prev,
      {
        id: "v_temp_" + Date.now() + Math.random().toString(36).substring(2, 6),
        sku: "",
        size: "L",
        color: "Black",
        stock: 50,
        price: "",
        discountPrice: "",
        files: [],
        imageUrls: [],
      },
    ]);
  };

  const handleRemoveVariantRow = (id) => {
    if (variants.length <= 1) {
      setErrorMsg("A product must contain at least one variant configuration.");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  const handleVariantChange = (id, field, value) => {
    setVariants((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          return { ...v, [field]: value };
        }
        return v;
      })
    );
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return setErrorMsg("Product Name is required.");
    }
    if (!basePrice || parseFloat(basePrice) <= 0) {
      return setErrorMsg("Please provide a valid Base / Original Price.");
    }
    if (variants.some((v) => !v.sku || !v.sku.trim())) {
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
      };

      await productService.saveProduct(productForm, variants);

      setSuccessMsg("Product successfully created!");
      setTimeout(() => {
        navigate("/admin/inventory");
      }, 1200);
    } catch (err) {
      console.error("Error creating product:", err);
      setErrorMsg(err.message || "Failed to create product listing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Discount calculation
  const parsedBase = parseFloat(basePrice) || 0;
  const parsedDiscount = parseFloat(discountPrice) || 0;
  const discountCalc =
    parsedBase > 0 && parsedDiscount > 0 && parsedDiscount < parsedBase
      ? Math.round(((parsedBase - parsedDiscount) / parsedBase) * 100)
      : null;

  return {
    categories,
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
    isTrending,
    setIsTrending,
    isFeatured,
    setIsFeatured,
    isBestSeller,
    setIsBestSeller,
    variants,
    handleAddVariantRow,
    handleRemoveVariantRow,
    handleVariantChange,
    handleSubmit,
    errorMsg,
    successMsg,
    isSubmitting,
    discountCalc,
  };
}

export default useAddProduct;
