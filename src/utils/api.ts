import axios from 'axios'

// Create an Axios instance pointing to our new backend
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Address of the Node.js backend
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
export const fetchDeals = () => API.get('/data/deals')
export const fetchPopularBrands = () => API.get('/data/brands/popular')
export const fetchCategories = () => API.get('/data/categories')

export default API
