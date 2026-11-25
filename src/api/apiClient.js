const BASE_URL = import.meta.env.VITE_API_BASE_URL || (
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") 
    ? "http://localhost:5000" 
    : `http://${window.location.hostname}:5000`
);

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  const isFormData = options.body instanceof FormData;

  // Automatically attach authentication credentials from active user session
  let authHeaders = {};
  try {
    const saved = localStorage.getItem("osmaki_user");
    if (saved) {
      const u = JSON.parse(saved);
      if (u.token) {
        authHeaders["Authorization"] = `Bearer ${u.token}`;
      }
    }
  } catch {}

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...authHeaders,
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === "object" && !isFormData) {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    if (response.status === 401) {
      // If unauthenticated or token missing from legacy session, prompt re-login
      try {
        const saved = localStorage.getItem("osmaki_user");
        if (saved) {
          const u = JSON.parse(saved);
          if (!u.token) {
            localStorage.removeItem("osmaki_user");
          }
        }
      } catch {}
    }
    const errorText = await response.text();
    let errorMessage = errorText;
    try {
      const parsed = JSON.parse(errorText);
      if (parsed.message) errorMessage = parsed.message;
      else if (parsed.error) errorMessage = parsed.error;
    } catch {}
    throw new Error(errorMessage || `Request failed with status ${response.status}`);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }
  
  return await response.text();
}

export const apiClient = {
  get: (endpoint, options) => request(endpoint, { ...options, method: "GET" }),
  post: (endpoint, body, options) => request(endpoint, { ...options, method: "POST", body }),
  put: (endpoint, body, options) => request(endpoint, { ...options, method: "PUT", body }),
  delete: (endpoint, options) => request(endpoint, { ...options, method: "DELETE" }),
};
