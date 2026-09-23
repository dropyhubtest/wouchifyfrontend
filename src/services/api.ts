import axios from 'axios';
import { cacheWrap } from './dataCache';

// Create a centralized Axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? '/api' : 'http://localhost:5000/api'),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Optional: Add request interceptors for Auth tokens if we have them in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getPublicStores = async () => {
  return cacheWrap('public:stores', async () => {
    try {
      const res = await api.get('/stores?status=active&public=true');
      return res.data;
    } catch (err) {
      console.error('Failed to fetch public stores', err);
      return [];
    }
  });
};

import { adminApi } from './adminApi';

export const getPublicCoupons = async () => {
  try {
    return await adminApi.getPublicCoupons();
  } catch (err) {
    console.error('Failed to fetch public coupons', err);
    return [];
  }
};

export const getPublicDeals = async () => {
  try {
    return await adminApi.getDeals();
  } catch (err) {
    console.error('Failed to fetch public deals', err);
    return [];
  }
};

export const getPublicLootDeals = async () => {
  try {
    return await adminApi.getLootDeals();
  } catch (err) {
    console.error('Failed to fetch public loot deals', err);
    return [];
  }
};

export default api;
