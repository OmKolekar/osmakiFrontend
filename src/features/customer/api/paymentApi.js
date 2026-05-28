import { apiClient } from "../../../api/apiClient";

export const paymentApi = {
  createPaymentRequest: (orderId) =>
    apiClient.post("/api/payments/create", { orderId }),

  verifyPayment: (verificationData) =>
    apiClient.post("/api/payments/verify", verificationData),

  processRefund: (orderId, reason) =>
    apiClient.post("/api/payments/refund", { orderId, reason }),
};
