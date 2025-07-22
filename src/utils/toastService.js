// src/services/toastService.js
import toast from 'react-hot-toast';

const toastService = {
    success: (message, options = {}) => toast.success(message, options),
    error: (message, options = {}) => toast.error(message, options),
    info: (message, options = {}) => toast(message, options),
    loading: (message, options = {}) => toast.loading(message, options),
    dismiss: (toastId) => toast.dismiss(toastId),
    update: (toastId, newOptions) => toast.success(newOptions.message, { id: toastId, ...newOptions }),
};

export default toastService;
