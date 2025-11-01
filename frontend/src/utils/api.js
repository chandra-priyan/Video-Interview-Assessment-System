import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

export const api = axios.create({
  baseURL,
  withCredentials: true
})

export default api
 
// Attach JWT from localStorage if present
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch {}
  return config
})
