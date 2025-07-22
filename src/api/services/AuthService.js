// src/api/authApi.js
import http from '../httpService';

export const loginUser = (credentials) =>
    http.post('/auth/login', credentials);