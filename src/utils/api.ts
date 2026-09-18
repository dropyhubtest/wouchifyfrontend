import axios from 'axios'

// Create an Axios instance pointing to our backend
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? '/api' : 'http://localhost:5000/api'), 
})

// Automatically attach the JWT token to every request if the user is logged in
API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('userInfo')
  if (userInfo) {
    const parsedInfo = JSON.parse(userInfo)
    if (parsedInfo.token) {
      req.headers.Authorization = `Bearer ${parsedInfo.token}`
    }
  }
  return req
})

// --- Authentication APIs ---
export const login = (credentials: any) => API.post('/auth/login', credentials)
export const register = (userData: any) => API.post('/auth/register', userData)
export const googleLogin = (token: string, isLogin: boolean) => API.post('/auth/google', { token, isLogin })

// --- Data Fetching APIs ---
export const fetchDeals = async () => {
  try {
    return await API.get('/data/deals')
  } catch (err) {
    try {
      return await API.get('/deals')
    } catch {
      return { data: [] }
    }
  }
}

export const fetchPopularBrands = async () => {
  try {
    return await API.get('/data/brands/popular')
  } catch (err) {
    try {
      return await API.get('/stores')
    } catch {
      return { data: [] }
    }
  }
}

export const fetchCategories = async () => {
  try {
    return await API.get('/data/categories')
  } catch (err) {
    try {
      return await API.get('/categories')
    } catch {
      return { data: [] }
    }
  }
}

export default API
