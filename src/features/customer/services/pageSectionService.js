import { apiClient } from "../../../api/apiClient";

export const pageSectionService = {
  getPageSections: async (pageName = "home") => {
    const data = await apiClient.get(`/api/page-sections?page=${pageName}`);
    if (!Array.isArray(data)) return [];
    return data;
  }
};
