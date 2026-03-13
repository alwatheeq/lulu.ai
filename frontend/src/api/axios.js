import axios from 'axios';

let baseUrl = import.meta.env.VITE_API_URL || '/api';

// Professional check: If the URL is absolute but doesn't end in /api, append it
if (baseUrl.startsWith('http') && !baseUrl.includes('/api')) {
    baseUrl = baseUrl.endsWith('/') ? `${baseUrl}api` : `${baseUrl}/api`;
}

console.log('Lulu API connecting to:', baseUrl);

const api = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('lulu_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle expired tokens
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Token is expired or invalid
            localStorage.removeItem('lulu_token');
            localStorage.removeItem('lulu_user');
            // Use window.location instead of useNavigate because this is outside a component
            if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
