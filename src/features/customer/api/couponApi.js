import { apiClient } from "../../../api/apiClient";

export const couponApi = {
  validateCoupon: (code, orderAmount) =>
    apiClient.post("/api/coupons/validate", { code, orderAmount }),
};
