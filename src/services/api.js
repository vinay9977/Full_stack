// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth services
export const login = (username, password) => {
  return api.post('/auth/token/', { username, password });
};

export const register = (userData) => {
  return api.post('/auth/register/', userData);
};

export const getUserProfile = () => {
  return api.get('/auth/profile/');
};

// Product services
export const getProducts = () => {
  return api.get('/api/products/');
};

export const getProductsByCategory = (category) => {
  return api.get(`/api/products/?category=${category}`);
};

// Cart services
export const getCart = () => {
  return api.get('/api/cart/');
};

export const addToCart = (productId, quantity = 1) => {
  return api.post('/api/cart/1/add_item/', { product_id: productId, quantity });
};

export const removeFromCart = (itemId) => {
  return api.post('/api/cart/1/remove_item/', { item_id: itemId });
};

// Contact form service
export const submitContactForm = (formData) => {
  return api.post('/api/contact/', formData);
};

export default api;