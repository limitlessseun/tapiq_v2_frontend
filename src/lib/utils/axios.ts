import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://tapiq.aitechstaging.com/api",
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        // Only run on client side
        if (typeof window === 'undefined') {
            return config;
        }

        try {
            // Get session directly from localStorage to match your store structure
            const sessionData = localStorage.getItem('session-storage');
            if (sessionData) {
                const parsed = JSON.parse(sessionData);
                // Match your store structure: state.session.accessToken
                const token = parsed?.state?.session?.accessToken;
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                    console.log('Auth token added to request');
                }
            }
        } catch (error) {
            console.error('Error setting auth header:', error);
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error?.response?.status === 401) {
            console.warn("Unauthorized — clearing session...");

            if (typeof window !== 'undefined') {
                // Use the same key as your store
                localStorage.removeItem('session-storage');
                // Small delay before redirect to ensure store is cleared
                setTimeout(() => {
                    window.location.href = '/auth/login';
                }, 100);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;