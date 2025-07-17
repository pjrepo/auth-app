import axios from "axios";

const API = axios.create({
  baseURL: "https://auth-app-server-x7zp.onrender.com/api/auth",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
