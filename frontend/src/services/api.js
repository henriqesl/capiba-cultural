import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("capiba_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isLoginRequest =
        error.config.url.includes("/login") ||
        error.config.url.includes("/auth");

      if (!isLoginRequest) {
        alert("Sessão expirada. Faça login novamente.");
        localStorage.removeItem("capiba_user");
        localStorage.removeItem("capiba_token");
        window.location.href = "/#/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
