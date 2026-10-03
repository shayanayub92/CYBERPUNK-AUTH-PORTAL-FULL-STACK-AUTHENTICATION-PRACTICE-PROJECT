import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || ''

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

let refreshPromise = null

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url?.includes('/api/auth/login') &&
      !original.url?.includes('/api/auth/refresh')
    ) {
      original._retry = true
      try {
        if (!refreshPromise) {
          refreshPromise = api.post('/api/auth/refresh').finally(() => {
            refreshPromise = null
          })
        }
        await refreshPromise
        return api(original)
      } catch {
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  },
)
