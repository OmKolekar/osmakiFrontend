import { useState, useEffect } from "react";
import { pageSectionService } from "../services/pageSectionService";

export function usePageSections(pageName = "home") {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await pageSectionService.getPageSections(pageName);
        if (isMounted) {
          setSections(data);
        }
      } catch (err) {
        console.error("Error loading page sections:", err);
        if (isMounted) {
          setError(err.message || "Failed to load page sections");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [pageName]);

  return { sections, loading, error };
}
