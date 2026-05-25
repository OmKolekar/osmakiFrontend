import { apiClient } from "../../../api/apiClient";

export const categoryApi = {
  getCategories: () => apiClient.get("/api/categories"),
};
export default categoryApi;
