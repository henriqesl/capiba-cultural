import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api', 
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.data.erro === "Token expirado")) {
      alert("Sua sessão expirou. Por favor, faça login novamente.");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "#/login"; // Redireciona para o login
    }
    return Promise.reject(error);
  }
);

export default api;