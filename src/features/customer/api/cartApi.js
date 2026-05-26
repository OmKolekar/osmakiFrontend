import { apiClient } from "../../../api/apiClient";

export const cartApi = {
  getCart: (userId) => apiClient.get(`/api/cart?userId=${userId}`),
  
  addToCart: (userId, variantId, quantity) => 
    apiClient.post("/api/cart/add", { userId, variantId, quantity }),
  
  updateQuantity: (userId, variantId, quantity) => 
    apiClient.post("/api/cart/update", { userId, variantId, quantity }),
  
  removeFromCart: (userId, variantId) => 
    apiClient.post("/api/cart/remove", { userId, variantId }),
  
  clearCart: (userId) => 
    apiClient.post("/api/cart/clear", { userId }),
};
