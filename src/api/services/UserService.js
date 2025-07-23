
import httpService from '../httpService';

export const getUserList = async (params) => {
    try {
        const data = await httpService.get('/user/list', params);
        return { success: true, data }
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

export const blockUnblockUser = async (credentials) => {
    try {
        const data = await httpService.post('/user/block-unblock', credentials);
        return { success: true, data }
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

export const removeUser = async (credentials) => {
    try {
        const data = await httpService.delete('/user/remove', credentials);
        return { success: true, data }
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


export const editUser = async (credentials) => {
    try {
        let formData = new FormData();
        for (const key in credentials) {
            if (credentials[key] !== undefined && credentials[key] !== null) {
                formData.append(key, credentials[key]);
            }
        }
        const data = await httpService.patch('/user/edit-user', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return { success: true, data }
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