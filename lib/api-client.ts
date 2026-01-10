// API Client for BeAFox Website
import axios from "axios";

const LOCAL_BASE_URL = "http://localhost:8989";
const PROD_BASE_URL = "https://api.software-as-solution.de";

const getBaseURL = () => {
  // Use localhost in development (both client and server-side)
  if (process.env.NODE_ENV === "development") {
    return LOCAL_BASE_URL;
  }
  // In production, use production URL
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
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        window.location.href = "/registrierung";
      }
    }
    return Promise.reject(error);
  }
);

export default client;
