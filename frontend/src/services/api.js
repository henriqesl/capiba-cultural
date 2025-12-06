import axios from 'axios';

// 1. Define a URL base do seu backend (geralmente porta 3000)
const api = axios.create({
    baseURL: 'http://localhost:3000/api', 
});

// 2. Interceptor: Antes de cada requisição, veja se tem token e anexa
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
});

export default api;