import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
    baseURL: 'http://localhost:5000/api', // Change when deploying
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request Interceptor
// Automatically intercept outgoing requests and attach JWT token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
// Monitor incoming responses for 401 Unauthorized globally
apiClient.interceptors.response.use(
    (response) => {
        // Return pure data straight from response seamlessly
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token likely expired or invalid
            console.warn('Session expired. Logging out gracefully.');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Redirect smoothly to login depending on paths
            if (window.location.pathname.startsWith('/partner') && window.location.pathname !== '/partner/login') {
                window.location.href = '/partner/login';
            } else if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/login') {
                window.location.href = '/login';
            } else if (!window.location.pathname.startsWith('/partner') && !window.location.pathname.startsWith('/admin') && window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
