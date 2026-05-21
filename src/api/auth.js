import { apiClient } from "./apiClient";

export const authApi = {
  sendOtp: (email) => apiClient.post("/auth/send-otp", { email }),
  
  verifyOtp: (email, otp) => apiClient.post("/auth/verify-otp", { email, otp }),
  
  register: ({ name, email, password, phone }) => 
    apiClient.post("/api/users/register", { name, email, password, phone }),

  login: (email, password) =>
    apiClient.post("/api/users/login", { email, password }),
};
