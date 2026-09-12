import axios from 'axios';

// Create a centralized Axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
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
  try {
    const res = await api.get('/stores?status=active&public=true');
    return res.data;
  } catch (err) {
    console.error('Failed to fetch public stores', err);
    return [];
  }
};

export const getPublicCoupons = async () => {
  try {
    const res = await api.get('/coupons?status=active&public=true');
    return res.data;
  } catch (err) {
    console.error('Failed to fetch public coupons', err);
    return [];
  }
};

export default api;
