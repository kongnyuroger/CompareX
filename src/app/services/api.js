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

export const register = (username, email, password) =>
  API.post("/auth/register", { username, email, password });

export const loginUser = (emailOrUsername, password) =>
  API.post("/auth/login", { emailOrUsername, password });

export const trendingProducts = () => API.get(`/search/trending`);

export const searchProduct = (searchTerm) =>
  API.get(`/ai/rank?q=${encodeURIComponent(searchTerm)}`);
