// src/api/axiosInstance.js
import axios from 'axios';
import { getConfig } from '../utils/config';

const axiosInstance = axios.create({
    baseURL: getConfig().API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => response.data,
    (error) => {
        // Global error handling
        if (error.response?.status === 401) {
            // handle unauthorized access
            localStorage.clear();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
