import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const CHATBOT_URL = process.env.REACT_APP_CHATBOT_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.put('/auth/profile', data)
};

// Products API
export const productsAPI = {
    getAll: (params) => api.get('/products', { params }),
    getById: (id) => api.get(`/products/${id}`),
    create: (data) => api.post('/products', data),
    update: (id, data) => api.put(`/products/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`)
};

// Pets API
export const petsAPI = {
    getAll: (params) => api.get('/pets', { params }),
    getAvailable: () => api.get('/pets/available'),
    getById: (id) => api.get(`/pets/${id}`),
    create: (data) => api.post('/pets', data),
    update: (id, data) => api.put(`/pets/${id}`, data),
    delete: (id) => api.delete(`/pets/${id}`)
};

// Orders API
export const ordersAPI = {
    create: (data) => api.post('/orders', data),
    getMyOrders: () => api.get('/orders/myorders'),
    getById: (id) => api.get(`/orders/${id}`),
    getAll: () => api.get('/orders'),
    updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
    cancel: (id) => api.put(`/orders/${id}/cancel`)
};

// Services API
export const servicesAPI = {
    getAll: (params) => api.get('/services', { params }),
    getById: (id) => api.get(`/services/${id}`),
    create: (data) => api.post('/services', data),
    update: (id, data) => api.put(`/services/${id}`, data),
    delete: (id) => api.delete(`/services/${id}`)
};

// Adoptions API
export const adoptionsAPI = {
    create: (data) => api.post('/adoptions', data),
    getMyRequests: () => api.get('/adoptions/myrequests'),
    getAll: (params) => api.get('/adoptions', { params }),
    approve: (id, note) => api.put(`/adoptions/${id}/approve`, { note }),
    reject: (id, note) => api.put(`/adoptions/${id}/reject`, { note })
};

// Admin API
export const adminAPI = {
    getStats: () => api.get('/admin/stats'),
    getUsers: () => api.get('/admin/users'),
    updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
    updateUserStatus: (id, isActive) => api.put(`/admin/users/${id}/status`, { isActive }),
    deleteUser: (id) => api.delete(`/admin/users/${id}`)
};

// Lost & Found API
export const lostFoundAPI = {
    getAll: (params) => api.get('/lostfound', { params }),
    getById: (id) => api.get(`/lostfound/${id}`),
    create: (data) => api.post('/lostfound', data),
    update: (id, data) => api.put(`/lostfound/${id}`, data),
    resolve: (id) => api.put(`/lostfound/${id}/resolve`),
    delete: (id) => api.delete(`/lostfound/${id}`)
};

// Reviews API
export const reviewsAPI = {
    getByTarget: (type, id) => api.get(`/reviews/${type}/${id}`),
    create: (data) => api.post('/reviews', data),
    update: (id, data) => api.put(`/reviews/${id}`, data),
    delete: (id) => api.delete(`/reviews/${id}`)
};

// Bookings API
export const bookingsAPI = {
    getMyBookings: () => api.get('/bookings/mybookings'),
    getAll: (params) => api.get('/bookings', { params }),
    create: (data) => api.post('/bookings', data),
    updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
    cancel: (id) => api.put(`/bookings/${id}/cancel`)
};

// Forum API
export const forumAPI = {
    getAll: (params) => api.get('/forum', { params }),
    getById: (id) => api.get(`/forum/${id}`),
    create: (data) => api.post('/forum', data),
    addReply: (id, content) => api.post(`/forum/${id}/reply`, { content }),
    like: (id) => api.put(`/forum/${id}/like`),
    delete: (id) => api.delete(`/forum/${id}`),
    pin: (id) => api.put(`/forum/${id}/pin`)
};

// Chatbot API
export const chatbotAPI = {
    sendMessage: async (message, history = []) => {
        const response = await axios.post(`${CHATBOT_URL}/chat`, { message, history });
        return response.data;
    }
};

export default api;
