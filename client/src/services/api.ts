import axios from 'axios';

// Access the environment variable securely in Vite
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercept requests to add admin JWT token if present
api.interceptors.request.use(
    (config) => {
        const adminToken = localStorage.getItem('adminToken');
        if (adminToken) {
            config.headers.Authorization = `Bearer ${adminToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercept responses to handle auth errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access (e.g., clear token, redirect to login)
            console.warn('Unauthorized access, perhaps token expired.');
            // Optional: window.location.href = '/admin/login';
        }
        return Promise.reject(error);
    }
);

export default api;
