// src/api/httpService.js
import axiosInstance from './axiosInstance';

const httpService = {
    get: (url, params = {}, config = {}) =>
        axiosInstance.get(url, { params, ...config }),

    post: (url, data = {}, config = {}) =>
        axiosInstance.post(url, data, config),

    put: (url, data = {}, config = {}) =>
        axiosInstance.put(url, data, config),

    patch: (url, data = {}, config = {}) =>
        axiosInstance.patch(url, data, config),

    delete: (url, config = {}) =>
        axiosInstance.delete(url, {
            data: config
        }),
};

export default httpService;
