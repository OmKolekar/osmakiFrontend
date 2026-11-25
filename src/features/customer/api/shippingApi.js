import { apiClient } from "../../../api/apiClient";

export const shippingApi = {
  checkServiceability: ({ deliveryPincode, pickupPincode, weight = 0.5, cod = 0 }) => {
    const params = new URLSearchParams({
      deliveryPincode,
      ...(pickupPincode ? { pickupPincode } : {}),
      weight: String(weight),
      cod: cod ? "1" : "0",
    });
    return apiClient.get(`/api/shipping/serviceability?${params.toString()}`);
  },

  getOrderCouriers: (orderId) =>
    apiClient.get(`/api/shipping/orders/${orderId}/couriers`),

  createShipmentOrder: (orderId) =>
    apiClient.post(`/api/shipping/orders/${orderId}/create`),

  assignCourier: (orderId, courierId = null) =>
    apiClient.post(`/api/shipping/orders/${orderId}/assign-courier`, { courierId }),

  requestPickup: (orderId, pickupDate = null) =>
    apiClient.post(`/api/shipping/orders/${orderId}/request-pickup`, { pickupDate }),

  generateLabel: (orderId) =>
    apiClient.post(`/api/shipping/orders/${orderId}/generate-label`),

  generateInvoice: (orderId) =>
    apiClient.post(`/api/shipping/orders/${orderId}/generate-invoice`),

  trackShipment: (orderId) =>
    apiClient.get(`/api/shipping/orders/${orderId}/track`),
};
