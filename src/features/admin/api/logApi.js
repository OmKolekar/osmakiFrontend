import { apiClient } from "../../../api/apiClient";

export const logApi = {
  getLogs: () => apiClient.get("/api/inventory-logs"),
};
export default logApi;
