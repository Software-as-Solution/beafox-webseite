// API Client for BeAFox Website
import axios from "axios";

const PROD_BASE_URL = "https://api.software-as-solution.de";

const getBaseURL = () => {
  // Check for explicit environment variable first (allows override)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Always use production API
  return PROD_BASE_URL;
};

const client = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to automatically add auth token
client.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error details for debugging
    if (error.response) {
      console.error("API Error:", {
        status: error.response.status,
        statusText: error.response.statusText,
        url: error.config?.url,
        data: error.response.data,
      });
    } else if (error.request) {
      console.error("Network Error:", {
        message: "No response received from server",
        url: error.config?.url,
      });
    } else {
      console.error("Request Error:", error.message);
    }

    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        window.location.href = "/registrierung";
      }
    }
    
    if (error.response?.status === 503) {
      console.error("Backend service unavailable. Check if Stripe is configured on the server.");
    }
    
    return Promise.reject(error);
  }
);

export default client;
