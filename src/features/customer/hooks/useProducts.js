import { useState, useEffect } from "react";
import { productService } from "../services/productService";

// In-memory module cache for instant 0ms access across route transitions
let _memoryProducts = null;
let _pendingFetch = null;
const CACHE_KEY = "osmaki_products_swr_cache";

function getCachedProducts() {
  if (_memoryProducts && Array.isArray(_memoryProducts)) {
    return _memoryProducts;
  }
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        _memoryProducts = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.warn("SWR cache read error:", err);
  }
  return null;
}

function setCachedProducts(data) {
  _memoryProducts = data;
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn("SWR cache write error:", err);
  }
}

function filterProducts(data, genderFilter, onlyTrending, onlyBestSeller) {
  if (!Array.isArray(data)) return [];
  let filtered = data;
  if (genderFilter) {
    filtered = filtered.filter(
      (p) => p.gender === genderFilter || p.gender === "Unisex"
    );
  }
  if (onlyTrending) {
    filtered = filtered.filter((p) => p.isTrending);
  }
  if (onlyBestSeller) {
    filtered = filtered.filter((p) => p.isBestSeller);
  }
  return filtered;
}

export function useProducts(genderFilter = null, onlyTrending = false, onlyBestSeller = false) {
  const cached = getCachedProducts();
  const initialProducts = cached
    ? filterProducts(cached, genderFilter, onlyTrending, onlyBestSeller)
    : [];

  // Instant 0ms render if cached data exists; otherwise show loader
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(cached === null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    // 1. Immediately apply filters if cached data is already present
    const existingCache = getCachedProducts();
    if (existingCache) {
      const currentFiltered = filterProducts(existingCache, genderFilter, onlyTrending, onlyBestSeller);
      setProducts(currentFiltered);
      setLoading(false);
    }

    // 2. Fetch fresh data in the background (Stale-While-Revalidate)
    async function revalidate() {
      try {
        if (!_pendingFetch) {
          _pendingFetch = productService.getProducts().finally(() => {
            _pendingFetch = null;
          });
        }
        const freshData = await _pendingFetch;
        if (!isMounted) return;

        setCachedProducts(freshData);
        const updated = filterProducts(freshData, genderFilter, onlyTrending, onlyBestSeller);
        setProducts(updated);
        setError("");
      } catch (err) {
        console.error("SWR background revalidation error:", err);
        if (isMounted && (!existingCache || existingCache.length === 0)) {
          setError("Failed to load products.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    revalidate();

    return () => {
      isMounted = false;
    };
  }, [genderFilter, onlyTrending, onlyBestSeller]);

  return { products, loading, error };
}
