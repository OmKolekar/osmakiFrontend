import { useState, useEffect } from "react";
import { productService } from "../services/productService";

export function useProducts(genderFilter = null, onlyTrending = false, onlyBestSeller = false) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await productService.getProducts();
        if (!isMounted) return;

        let filtered = data;
        if (genderFilter) {
          filtered = filtered.filter(p => p.gender === genderFilter || p.gender === "Unisex");
        }
        if (onlyTrending) {
          filtered = filtered.filter(p => p.isTrending);
        }
        if (onlyBestSeller) {
          filtered = filtered.filter(p => p.isBestSeller);
        }
        setProducts(filtered);
      } catch (err) {
        console.error("Error fetching products in hook:", err);
        if (isMounted) setError("Failed to load products.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [genderFilter, onlyTrending, onlyBestSeller]);

  return { products, loading, error };
}
