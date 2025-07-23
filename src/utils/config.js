

export const config = {
    dev: {
        API_BASE_URL: `${import.meta.env.VITE_API_BASE_URL_LOCAL}/v1/admin`,
        API_KEY: import.meta.env.VITE_API_KEY_LOCAL || 'default-dev-key',
        GOOGLE_API_KEY: import.meta.env.VITE_API_GOOGLE_API_KEY || 'default'
    }
}


export const getConfig = () => {
    return config[import.meta.env.VITE_ENVIRONMENT || 'dev']
}