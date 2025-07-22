

export const config = {
    dev: {
        API_BASE_URL: `${process.env.VITE_API_BASE_URL_LOCAL}/v1/admin`
    }
}


export const getConfig = () => {
    return config[process.env.VITE_ENVIRONMENT || 'dev']
}