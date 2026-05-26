import { apiClient } from "../../../api/apiClient";

export const productApi = {
  getProducts: () => apiClient.get("/api/products"),
  getProductById: (id) => apiClient.get(`/api/products/${id}`),
};
