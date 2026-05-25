import { apiClient } from "../../../api/apiClient";

export const productApi = {
  getProducts: () => apiClient.get("/api/products"),
  
  createProduct: (payload) => apiClient.post("/api/products", payload),

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const result = await apiClient.post("/api/upload?folder=osmaki/products", formData);
    if (result && result.success && result.imageUrl) {
      return result.imageUrl;
    }
    throw new Error("Failed to upload variant image to storage.");
  },

  adjustVariantStock: (variantId, payload) => 
    apiClient.post(`/api/products/variants/${variantId}/adjust`, payload)
};
export default productApi;
