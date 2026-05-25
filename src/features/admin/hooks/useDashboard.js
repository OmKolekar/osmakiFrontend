import { useState, useEffect } from "react";
import dashboardApi from "../api/dashboardApi";

export function useDashboard() {
  const [metrics, setMetrics] = useState({
    totalProductsCount: 0,
    totalStock: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    totalValuation: 0,
  });
  const [focusList, setFocusList] = useState({
    outOfStock: [],
    lowStock: [],
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await dashboardApi.getDashboardStats();

      if (response) {
        if (response.metrics) setMetrics(response.metrics);
        if (response.focusList) setFocusList(response.focusList);
        if (response.recentActivity) setRecentActivity(response.recentActivity);
      }
    } catch (err) {
      console.error("Error loading dashboard metrics:", err);
      setError("Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  return {
    metrics,
    focusList,
    recentActivity,
    loading,
    error,
    refetch: fetchDashboardData,
  };
}
export default useDashboard;
