import axios from "axios";

const API = axios.create({
  baseURL: process.env.API_URL,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
  }
  return req;
});

export const register = (username, email, password) =>
  API.post("/auth/register", { username, email, password });

export const loginUser = (emailOrUsername, password) =>
  API.post("/auth/login", { emailOrUsername, password });
