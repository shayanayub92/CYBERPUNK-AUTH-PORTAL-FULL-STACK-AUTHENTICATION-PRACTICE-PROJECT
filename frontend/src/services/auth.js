import { api } from './api'

export const authApi = {
  register: (data) => api.post('/api/auth/register', data),
  verifyEmail: (data) => api.post('/api/auth/verify-email', data),
  resendVerification: (data) => api.post('/api/auth/resend-verification', data),
  login: (data) => api.post('/api/auth/login', data),
  logout: () => api.post('/api/auth/logout'),
  me: () => api.get('/api/auth/me'),
  forgotPassword: (data) => api.post('/api/auth/forgot-password', data),
  verifyResetOtp: (data) => api.post('/api/auth/verify-reset-otp', data),
  resetPassword: (data) => api.post('/api/auth/reset-password', data),
}

export const usersApi = {
  updateProfile: (data) => api.put('/api/users/profile', data),
  changePassword: (data) => api.post('/api/users/change-password', data),
}
