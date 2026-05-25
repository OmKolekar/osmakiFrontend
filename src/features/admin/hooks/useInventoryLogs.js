import { useState, useEffect } from "react";
import logApi from "../api/logApi";

export function useInventoryLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await logApi.getLogs();
      if (Array.isArray(data)) {
        setLogs(data);
      }
    } catch (err) {
      console.error("Error loading inventory logs:", err);
      setError("Failed to load inventory log entries.");
    } finally {
      setLoading(false);
    }
  };

  return {
    logs,
    loading,
    error,
    refetch: fetchLogs,
  };
}
export default useInventoryLogs;
