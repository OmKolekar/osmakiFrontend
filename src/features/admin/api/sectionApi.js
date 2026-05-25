import { apiClient } from "../../../api/apiClient";

export const sectionApi = {
  getSections: () => apiClient.get("/api/page-sections"),

  createSection: (payload) => apiClient.post("/api/page-sections", payload),

  updateSection: (id, payload) => apiClient.put(`/api/page-sections/${id}`, payload),

  deleteSection: (id) => apiClient.delete(`/api/page-sections/${id}`),

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const result = await apiClient.post("/api/upload", formData);
    if (result && result.success && result.imageUrl) {
      return result.imageUrl;
    }
    throw new Error("Invalid response received from upload server.");
  },
};
export default sectionApi;
