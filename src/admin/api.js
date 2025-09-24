import axios from 'axios';

const BASE_URL = 'https://e-commerce-backend-7yft.onrender.com/api';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const login = (data) => api.post('/dj-rest-auth/login/', data);
export const register = (data) => api.post('/dj-rest-auth/registration/', data);
export const getItems = (token) => api.get('/items/', { headers: { Authorization: `Bearer ${token}` } });
export const createItem = (data, token) => api.post('/items/', data, { headers: { Authorization: `Bearer ${token}` } });
export const updateItem = (id, data, token) => api.put(`/items/${id}/`, data, { headers: { Authorization: `Bearer ${token}` } });
export const deleteItem = (id, token) => api.delete(`/items/${id}/`, { headers: { Authorization: `Bearer ${token}` } });
