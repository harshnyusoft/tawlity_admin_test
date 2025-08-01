// src/api/authApi.js
import http from '../httpService';

export const loginUser = async (credentials) => {
    try {
        const data = await http.post('/login', credentials);
        return { success: true, data };
    } catch (error) {
        let errorMsg = 'An error occurred. Please try again.';
        if (error.response && error.response.data && error.response.data.message) {
            errorMsg = error.response.data.message;
        } else if (error.message) {
            errorMsg = error.message;
        }
        return { success: false, error: errorMsg };
    }
};


export const forgotPassword = async (credentials) => {
    try {
        const data = await http.post('/forgot-password-post', credentials);
        return { success: true, data };
    } catch (error) {
        let errorMsg = 'An error occurred. Please try again.';
        if (error.response && error.response.data && error.response.data.message) {
            errorMsg = error.response.data.message;
        } else if (error.message) {
            errorMsg = error.message;
        }
        return { success: false, error: errorMsg };
    }
};


export const resetPassword = async (credentials) => {
    try {
        const data = await http.post('/reset-password-post', credentials);
        return { success: true, data };
    } catch (error) {
        let errorMsg = 'An error occurred. Please try again.';
        if (error.response && error.response.data && error.response.data.message) {
            errorMsg = error.response.data.message;
        } else if (error.message) {
            errorMsg = error.message;
        }
        return { success: false, error: errorMsg };
    }
};

export const editProfile = async ({ first_name, last_name, email }) => {
    try {
        const data = await http.post('/update-my-profile', { first_name, last_name, email });
        return { success: true, data };
    } catch (error) {
        let errorMsg = 'An error occurred. Please try again.';
        if (error.response && error.response.data && error.response.data.message) {
            errorMsg = error.response.data.message;
        } else if (error.message) {
            errorMsg = error.message;
        }
        return { success: false, error: errorMsg };
    }
};


export const changePassword = async ({ current_password, new_password, confirm_password }) => {
    try {
        const data = await http.post('/change-password-post', { current_password, new_password, confirm_password });
        return { success: true, data };
    } catch (error) {
        let errorMsg = 'An error occurred. Please try again.';
        if (error.response && error.response.data && error.response.data.message) {
            errorMsg = error.response.data.message;
        } else if (error.message) {
            errorMsg = error.message;
        }
        return { success: false, error: errorMsg };
    }
};

