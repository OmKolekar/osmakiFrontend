import { apiClient } from "../../../api/apiClient";

export const dashboardApi = {
  getDashboardStats: () => apiClient.get("/api/admin/dashboard-stats"),
};
export default dashboardApi;
