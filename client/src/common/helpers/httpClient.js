// localhost
// import axios from 'axios';

// function HttpClient() {
//     const handleSessionExpired = () => {
//         localStorage.removeItem('_HYPER_AUTH');
//         window.location.href = '/account/session-expired';
//     };

//     const refreshAccessToken = async () => {
//         try {
//             const userData = JSON.parse(localStorage.getItem('_HYPER_AUTH') || '{}');
//             const refreshToken = userData.tokens?.refresh;
//             const refreshExpiresAt = userData.tokens?.refreshExpiresAt;
            
//             if (!refreshToken) {
//                 throw new Error('No refresh token available');
//             }

//             if (refreshExpiresAt && new Date(refreshExpiresAt) <= new Date()) {
//                 throw new Error('Refresh token expired');
//             }

//             const baseURL = import.meta.env.VITE_API_URL || '';
//             const response = await axios({
//                 method: 'post',
//                 url: `${baseURL}/auth/refresh`,
//                 data: { refresh_token: refreshToken },
//                 headers: { 'Content-Type': 'application/json' },
//                 withCredentials: false
//             });
            
//             if (response?.data?.data?.tokens) {
//                 return response.data.data.tokens;
//             } else {
//                 throw new Error('Invalid token response format');
//             }
//         } catch (error) {
//             console.error('Error refreshing token:', error);
//             handleSessionExpired();
//             throw new Error('Session expired. Please login again.');
//         }
//     };

//     const _errorHandler = async (error) => {
//         if (error.code === 'ECONNABORTED') {
//             return Promise.reject('Request timed out. Please try again.');
//         }

//         if (!error.response) {
//             return Promise.reject('Network error. Please check your connection.');
//         }

//         if (error.response.status === 401) {
//             const originalRequest = error.config;
            
//             if (originalRequest._retry || originalRequest.url.includes('/auth/refresh')) {
//                 handleSessionExpired();
//                 return Promise.reject('Session expired. Please login again.');
//             }

//             originalRequest._retry = true;

//             try {
//                 const newTokens = await refreshAccessToken();
//                 const userData = JSON.parse(localStorage.getItem('_HYPER_AUTH') || '{}');
//                 userData.tokens = newTokens;
//                 localStorage.setItem('_HYPER_AUTH', JSON.stringify(userData));

//                 originalRequest.headers['Authorization'] = `Bearer ${newTokens.access}`;
//                 return _httpClient.request(originalRequest);
//             } catch (refreshError) {
//                 return Promise.reject(refreshError);
//             }
//         }

//         const errorMessage = error.response?.data?.message || 
//                             error.response?.data?.error || 
//                             error.message || 
//                             'An unknown error occurred';
        
//         return Promise.reject(errorMessage);
//     };

//     const baseURL = import.meta.env.VITE_API_URL || '';
    
//     const _httpClient = axios.create({
//         baseURL,
//         timeout: 30000,
//         withCredentials: false
//     });

//     _httpClient.interceptors.request.use(config => {
//         const userData = JSON.parse(localStorage.getItem('_HYPER_AUTH') || '{}');
//         const token = userData.tokens?.access;
        
//         if (token) {
//             config.headers['Authorization'] = `Bearer ${token}`;
//         }

//         if (!(config.data instanceof FormData)) {
//             config.headers['Content-Type'] = 'application/json';
//         }
        
//         return config;
//     }, error => Promise.reject(error));

//     _httpClient.interceptors.response.use(
//         response => response.data,
//         _errorHandler
//     );

//     return {
//         get: (url, config = {}) => _httpClient.get(url, config),
//         post: (url, data, config = {}) => _httpClient.post(url, data, config),
//         patch: (url, data, config = {}) => _httpClient.patch(url, data, config),
//         put: (url, data, config = {}) => _httpClient.put(url, data, config),
//         delete: (url, config = {}) => _httpClient.delete(url, config),
//         client: _httpClient,
//     };
// }

// export default HttpClient();

import axios from 'axios';

function HttpClient() {
    const handleSessionExpired = () => {
        localStorage.removeItem('_HYPER_AUTH');
        window.location.href = '/account/session-expired';
    };

    const refreshAccessToken = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem('_HYPER_AUTH') || '{}');
            const refreshToken = userData.tokens?.refresh;
            const refreshExpiresAt = userData.tokens?.refreshExpiresAt;
            
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            if (refreshExpiresAt && new Date(refreshExpiresAt) <= new Date()) {
                throw new Error('Refresh token expired');
            }

            // Direct axios call to avoid circular dependencies
            const response = await axios({
                method: 'post',
                url: `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/refresh`,
                data: { refresh_token: refreshToken },
                headers: { 'Content-Type': 'application/json' },
                withCredentials: false
            });
            
            if (response?.data?.data?.tokens) {
                return response.data.data.tokens;
            } else {
                throw new Error('Invalid token response format');
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
            handleSessionExpired();
            throw new Error('Session expired. Please login again.');
        }
    };

    const _errorHandler = async (error) => {
        if (error.code === 'ECONNABORTED') {
            return Promise.reject('Request timed out. Please try again.');
        }

        if (!error.response) {
            return Promise.reject('Network error. Please check your connection.');
        }

        if (error.response.status === 401) {
            const originalRequest = error.config;
            
            if (originalRequest._retry || originalRequest.url.includes('/auth/refresh')) {
                handleSessionExpired();
                return Promise.reject('Session expired. Please login again.');
            }

            originalRequest._retry = true;

            try {
                const newTokens = await refreshAccessToken();
                const userData = JSON.parse(localStorage.getItem('_HYPER_AUTH') || '{}');
                userData.tokens = newTokens;
                localStorage.setItem('_HYPER_AUTH', JSON.stringify(userData));

                originalRequest.headers['Authorization'] = `Bearer ${newTokens.access}`;
                return _httpClient.request(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.error || 
                            error.message || 
                            'An unknown error occurred';
        
        return Promise.reject(errorMessage);
    };

    const _httpClient = axios.create({
        baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
        timeout: 30000,
        withCredentials: false // Try without credentials
    });

    _httpClient.interceptors.request.use(config => {
        const userData = JSON.parse(localStorage.getItem('_HYPER_AUTH') || '{}');
        const token = userData.tokens?.access;
        
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        if (!(config.data instanceof FormData)) {
            config.headers['Content-Type'] = 'application/json';
        }
        
        return config;
    }, error => Promise.reject(error));

    _httpClient.interceptors.response.use(
        response => response.data,
        _errorHandler
    );

    return {
        get: (url, config = {}) => _httpClient.get(url, config),
        post: (url, data, config = {}) => _httpClient.post(url, data, config),
        patch: (url, data, config = {}) => _httpClient.patch(url, data, config),
        put: (url, data, config = {}) => _httpClient.put(url, data, config),
        delete: (url, config = {}) => _httpClient.delete(url, config),
        client: _httpClient,
    };
}

export default HttpClient();