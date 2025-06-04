// API service for Platypus Liquor Store
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.platypusliquor.co.ke/v1'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('platypus-auth-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('platypus-auth-token')
      localStorage.removeItem('platypus-user-data')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Products API
export const productsAPI = {
  getAll: (params = {}) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (category, params = {}) => api.get(`/products/category/${category}`, { params }),
  getFeatured: () => api.get('/products/featured'),
  search: (query, params = {}) => api.get('/products/search', { params: { q: query, ...params } }),
}

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
}

// Authentication API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
}

// User API
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  getOrders: (params = {}) => api.get('/user/orders', { params }),
  getAddresses: () => api.get('/user/addresses'),
  addAddress: (address) => api.post('/user/addresses', address),
  updateAddress: (id, address) => api.put(`/user/addresses/${id}`, address),
  deleteAddress: (id) => api.delete(`/user/addresses/${id}`),
  getWishlist: () => api.get('/user/wishlist'),
  addToWishlist: (productId) => api.post('/user/wishlist', { productId }),
  removeFromWishlist: (productId) => api.delete(`/user/wishlist/${productId}`),
}

// Orders API
export const ordersAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getById: (id) => api.get(`/orders/${id}`),
  track: (id) => api.get(`/orders/${id}/track`),
  cancel: (id) => api.post(`/orders/${id}/cancel`),
}

// Payments API
export const paymentsAPI = {
  initiateMpesa: (orderData) => api.post('/payments/mpesa/initiate', orderData),
  checkMpesaStatus: (checkoutId) => api.get(`/payments/mpesa/status/${checkoutId}`),
  initiateAirtelMoney: (orderData) => api.post('/payments/airtel/initiate', orderData),
  processCard: (paymentData) => api.post('/payments/card/process', paymentData),
}

// Delivery API
export const deliveryAPI = {
  getZones: () => api.get('/delivery/zones'),
  calculateFee: (address) => api.post('/delivery/calculate-fee', address),
  getTimeSlots: (date, zone) => api.get('/delivery/time-slots', { params: { date, zone } }),
  track: (deliveryId) => api.get(`/delivery/track/${deliveryId}`),
}

// Reviews API
export const reviewsAPI = {
  getByProduct: (productId, params = {}) => api.get(`/reviews/product/${productId}`, { params }),
  create: (reviewData) => api.post('/reviews', reviewData),
  update: (id, reviewData) => api.put(`/reviews/${id}`, reviewData),
  delete: (id) => api.delete(`/reviews/${id}`),
  getByUser: (params = {}) => api.get('/reviews/user', { params }),
}

// Promotions API
export const promotionsAPI = {
  getActive: () => api.get('/promotions/active'),
  getById: (id) => api.get(`/promotions/${id}`),
  applyCoupon: (code) => api.post('/promotions/apply-coupon', { code }),
}

// Notifications API
export const notificationsAPI = {
  getAll: (params = {}) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
}

// Analytics API (for admin)
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getSales: (params = {}) => api.get('/analytics/sales', { params }),
  getPopularProducts: (params = {}) => api.get('/analytics/popular-products', { params }),
  getCustomerInsights: (params = {}) => api.get('/analytics/customers', { params }),
}

// Inventory API (for admin)
export const inventoryAPI = {
  getAll: (params = {}) => api.get('/inventory', { params }),
  updateStock: (productId, quantity) => api.put(`/inventory/${productId}/stock`, { quantity }),
  getLowStock: () => api.get('/inventory/low-stock'),
  bulkUpdate: (updates) => api.post('/inventory/bulk-update', updates),
}

// Support API
export const supportAPI = {
  createTicket: (ticketData) => api.post('/support/tickets', ticketData),
  getTickets: (params = {}) => api.get('/support/tickets', { params }),
  getTicketById: (id) => api.get(`/support/tickets/${id}`),
  updateTicket: (id, data) => api.put(`/support/tickets/${id}`, data),
  addTicketMessage: (ticketId, message) => api.post(`/support/tickets/${ticketId}/messages`, message),
}

// SMS API (for notifications)
export const smsAPI = {
  sendOrderConfirmation: (orderData) => api.post('/sms/order-confirmation', orderData),
  sendDeliveryUpdate: (deliveryData) => api.post('/sms/delivery-update', deliveryData),
  sendPromotion: (promotionData) => api.post('/sms/promotion', promotionData),
}

export default api
