import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      const token = localStorage.getItem("token");
      if (token) {
        // Token was rejected server-side – clear it and redirect
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        window.location.href = "/";
      }
      // No token = already logged out; just let the error propagate silently
    }
    return Promise.reject(error);
  },
);

export const register = (username, email, password) =>
  API.post("/auth/register", { username, email, password });

export const loginUser = (emailOrUsername, password) =>
  API.post("/auth/login", { emailOrUsername, password });

export const trendingProducts = () => API.get(`/search/trending`);

//export const searchProduct = (searchTerm) =>
// API.get(`/searchHistory?q=${encodeURIComponent(searchTerm)}`);

export const searchHistory = () => API.get(`/search/history`);

export const searchHistoryById = (searchId) =>
  API.get(`/search/results/${searchId}`);

export const deleteSearchHistoryItem = (searchId) =>
  API.delete(`/searchHistory/history/${searchId}`);

export const clearSearchHistory = () => API.delete(`/searchHistory/history`);
