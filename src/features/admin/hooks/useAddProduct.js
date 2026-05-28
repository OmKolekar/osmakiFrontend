import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import categoryApi from "../api/categoryApi";
import productService from "../services/productService";

export function useAddProduct() {
  const navigate = useNavigate();

  // Categories list
  const [categories, setCategories] = useState([]);

  // Product Fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [gender, setGender] = useState("Unisex");
  const [brand, setBrand] = useState("");

  // Promotion Toggles
  const [isTrending, setIsTrending] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);

  // Variants Array
  const [variants, setVariants] = useState([
    { id: "v_init_1", sku: "", size: "", color: "", price: "", discountPrice: "", stock: 0, files: [] }
  ]);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const list = await categoryApi.getCategories();
        if (Array.isArray(list)) {
          setCategories(list);
          if (list.length > 0) {
            setCategoryId(list[0].id); // select first category by default
          }
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
        setErrorMsg("Failed to load categories from the server.");
      }
    }
    loadCategories();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!name.trim()) return setErrorMsg("Product Name is required.");
    if (variants.some((v) => !v.sku.trim())) return setErrorMsg("Each variant must possess a unique SKU.");

    try {
      setIsSubmitting(true);
      setErrorMsg("");
      setSuccessMsg("");

      const productForm = {
        name,
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

      setSuccessMsg("Product successfully added to the catalog!");
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
    categories,
    name,
    setName,
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
    errorMsg,
    successMsg,
    isSubmitting,
    isTrending,
    setIsTrending,
    isFeatured,
    setIsFeatured,
    isBestSeller,
    setIsBestSeller,
    handleAddVariantRow,
    handleRemoveVariantRow,
    handleVariantChange,
    handleSubmit,
  };
}
export default useAddProduct;
