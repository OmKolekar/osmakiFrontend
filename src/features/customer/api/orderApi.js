import { apiClient } from "../../../api/apiClient";

export const orderApi = {
  getCheckoutSummary: (userId, addressId, couponCode, shippingMethod) =>
    apiClient.post("/api/orders/checkout-summary", { userId, addressId, couponCode, shippingMethod }),

  createOrder: (userId, addressId, couponCode, shippingMethod, paymentMethod = "online") =>
    apiClient.post("/api/orders/create", { userId, addressId, couponCode, shippingMethod, paymentMethod }),

  getUserOrders: (userId) =>
    apiClient.get(`/api/orders/user?userId=${userId}`),

  getOrderDetails: (orderId) =>
    apiClient.get(`/api/orders/${orderId}`),

  cancelOrder: (orderId) =>
    apiClient.post(`/api/orders/${orderId}/cancel`),

  getAddresses: (userId) =>
    apiClient.get(`/api/orders/addresses?userId=${userId}`),

  addAddress: (addressData) =>
    apiClient.post("/api/orders/addresses/add", addressData),

  // Admin endpoints
  getAdminOrders: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return apiClient.get(`/api/orders/admin/list?${params}`);
  },

  updateOrderStatus: (orderId, status, shipmentDetails) =>
    apiClient.put(`/api/orders/admin/${orderId}/status`, { status, ...shipmentDetails }),

  refundOrder: (orderId, reason) =>
    apiClient.post(`/api/orders/admin/${orderId}/refund`, { reason }),
};
