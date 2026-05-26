import { useState, useEffect } from "react";
import { productService } from "../services/productService";

export function useProductDetail(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await productService.getProductById(id);
        if (!isMounted) return;
        if (data) {
          setProduct(data);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Error fetching product detail in hook:", err);
        if (isMounted) setError("Product not found");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [id]);

  return { product, loading, error };
}
