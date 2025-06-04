// Enhanced API Service with fallback mechanisms
import { 
  productsAPI, 
  authAPI, 
  userAPI, 
  ordersAPI, 
  paymentsAPI, 
  deliveryAPI 
} from './api.js'
import { products } from '../data/products.js'
import toast from 'react-hot-toast'

// Environment configuration
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' || false
const API_TIMEOUT = 5000

// Helper function to simulate API delay for development
const simulateApiDelay = (ms = 1000) => 
  new Promise(resolve => setTimeout(resolve, ms))

// Error handler with user-friendly messages
const handleApiError = (error, fallbackData = null) => {
  console.error('API Error:', error)
  
  if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNABORTED') {
    toast.error('Connection error. Using offline data.')
    return fallbackData
  }
  
  if (error.response?.status === 500) {
    toast.error('Server error. Please try again later.')
  } else if (error.response?.status === 404) {
    toast.error('Resource not found.')
  } else {
    toast.error(error.response?.data?.message || 'Something went wrong.')
  }
  
  throw error
}

// Products Service
export const ProductsService = {
  async getAll(params = {}) {
    if (USE_MOCK_DATA) {
      await simulateApiDelay()
      return {
        data: products.filter(product => {
          if (params.category && product.category !== params.category) return false
          if (params.search && !product.name.toLowerCase().includes(params.search.toLowerCase())) return false
          return true
        })
      }
    }

    try {
      return await productsAPI.getAll(params)
    } catch (error) {
      return handleApiError(error, { data: products })
    }
  },

  async getById(id) {
    if (USE_MOCK_DATA) {
      await simulateApiDelay()
      const product = products.find(p => p.id === parseInt(id))
      if (!product) throw new Error('Product not found')
      return { data: product }
    }

    try {
      return await productsAPI.getById(id)
    } catch (error) {
      const fallbackProduct = products.find(p => p.id === parseInt(id))
      return handleApiError(error, { data: fallbackProduct })
    }
  },

  async getFeatured() {
    if (USE_MOCK_DATA) {
      await simulateApiDelay()
      return { data: products.filter(p => p.featured).slice(0, 8) }
    }

    try {
      return await productsAPI.getFeatured()
    } catch (error) {
      return handleApiError(error, { data: products.slice(0, 8) })
    }
  },

  async search(query, params = {}) {
    if (USE_MOCK_DATA) {
      await simulateApiDelay()
      const results = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      )
      return { data: results }
    }

    try {
      return await productsAPI.search(query, params)
    } catch (error) {
      const fallbackResults = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase())
      )
      return handleApiError(error, { data: fallbackResults })
    }
  }
}

// Authentication Service
export const AuthService = {
  async login(credentials) {
    if (USE_MOCK_DATA) {
      await simulateApiDelay()
      
      // Mock validation
      if (credentials.email === 'test@platypus.co.ke' && credentials.password === 'password123') {
        const mockUser = {
          id: 1,
          email: credentials.email,
          firstName: 'John',
          lastName: 'Doe',
          phone: '+254712345678',
          isVerified: true
        }
        
        const mockToken = 'mock-jwt-token-' + Date.now()
        localStorage.setItem('platypus-auth-token', mockToken)
        localStorage.setItem('platypus-user-data', JSON.stringify(mockUser))
        
        return { 
          data: { 
            user: mockUser, 
            token: mockToken,
            message: 'Login successful' 
          } 
        }
      }
      
      throw new Error('Invalid credentials')
    }

    try {
      const response = await authAPI.login(credentials)
      
      // Store auth data
      localStorage.setItem('platypus-auth-token', response.data.token)
      localStorage.setItem('platypus-user-data', JSON.stringify(response.data.user))
      
      return response
    } catch (error) {
      handleApiError(error)
    }
  },

  async register(userData) {
    if (USE_MOCK_DATA) {
      await simulateApiDelay()
      
      // Mock user creation
      const mockUser = {
        id: Date.now(),
        ...userData,
        isVerified: false,
        createdAt: new Date().toISOString()
      }
      
      const mockToken = 'mock-jwt-token-' + Date.now()
      localStorage.setItem('platypus-auth-token', mockToken)
      localStorage.setItem('platypus-user-data', JSON.stringify(mockUser))
      
      return { 
        data: { 
          user: mockUser, 
          token: mockToken,
          message: 'Registration successful' 
        } 
      }
    }

    try {
      const response = await authAPI.register(userData)
      
      // Store auth data
      localStorage.setItem('platypus-auth-token', response.data.token)
      localStorage.setItem('platypus-user-data', JSON.stringify(response.data.user))
      
      return response
    } catch (error) {
      handleApiError(error)
    }
  },

  async logout() {
    try {
      if (!USE_MOCK_DATA) {
        await authAPI.logout()
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Always clear local storage
      localStorage.removeItem('platypus-auth-token')
      localStorage.removeItem('platypus-user-data')
    }
  }
}

// Orders Service
export const OrdersService = {
  async create(orderData) {
    if (USE_MOCK_DATA) {
      await simulateApiDelay(2000) // Simulate processing time
      
      const mockOrder = {
        ...orderData,
        id: `PL${Date.now()}`,
        number: `PL-${Date.now().toString().slice(-6)}`,
        status: 'confirmed',
        paymentStatus: 'completed',
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
      }
      
      // Store in localStorage
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]')
      existingOrders.push(mockOrder)
      localStorage.setItem('orders', JSON.stringify(existingOrders))
      
      return { data: mockOrder }
    }

    try {
      return await ordersAPI.create(orderData)
    } catch (error) {
      handleApiError(error)
    }
  },

  async getById(id) {
    if (USE_MOCK_DATA) {
      await simulateApiDelay()
      
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]')
      const order = existingOrders.find(o => o.id === id)
      
      if (!order) throw new Error('Order not found')
      return { data: order }
    }

    try {
      return await ordersAPI.getById(id)
    } catch (error) {
      handleApiError(error)
    }
  },

  async getUserOrders(params = {}) {
    if (USE_MOCK_DATA) {
      await simulateApiDelay()
      
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]')
      return { data: existingOrders }
    }

    try {
      return await userAPI.getOrders(params)
    } catch (error) {
      return handleApiError(error, { data: [] })
    }
  }
}

// Payments Service
export const PaymentsService = {
  async initiateMpesa(orderData) {
    if (USE_MOCK_DATA) {
      await simulateApiDelay(3000) // Simulate M-Pesa processing
      
      return {
        data: {
          checkoutId: `CHK${Date.now()}`,
          status: 'pending',
          message: 'M-Pesa payment request sent to your phone'
        }
      }
    }

    try {
      return await paymentsAPI.initiateMpesa(orderData)
    } catch (error) {
      handleApiError(error)
    }
  },

  async checkMpesaStatus(checkoutId) {
    if (USE_MOCK_DATA) {
      await simulateApiDelay(1000)
      
      return {
        data: {
          status: 'completed',
          transactionId: `MP${Date.now()}`,
          message: 'Payment completed successfully'
        }
      }
    }

    try {
      return await paymentsAPI.checkMpesaStatus(checkoutId)
    } catch (error) {
      handleApiError(error)
    }
  }
}

// Delivery Service
export const DeliveryService = {
  async getZones() {
    if (USE_MOCK_DATA) {
      await simulateApiDelay()
      
      return {
        data: [
          { id: 1, name: 'Nairobi CBD', fee: 200, timeSlots: ['9:00-12:00', '14:00-17:00'] },
          { id: 2, name: 'Westlands', fee: 300, timeSlots: ['9:00-12:00', '14:00-17:00'] },
          { id: 3, name: 'Karen', fee: 400, timeSlots: ['9:00-12:00', '14:00-17:00'] },
          { id: 4, name: 'Nakuru', fee: 500, timeSlots: ['10:00-13:00', '15:00-18:00'] }
        ]
      }
    }

    try {
      return await deliveryAPI.getZones()
    } catch (error) {
      return handleApiError(error, { data: [] })
    }
  },

  async calculateFee(address) {
    if (USE_MOCK_DATA) {
      await simulateApiDelay()
      
      // Simple fee calculation based on city
      const fees = {
        'nairobi': 200,
        'nakuru': 500,
        'mombasa': 800,
        'kisumu': 600
      }
      
      const fee = fees[address.city?.toLowerCase()] || 400
      
      return {
        data: {
          fee,
          estimatedDays: fee > 500 ? 3 : 2,
          zones: [`${address.city} Area`]
        }
      }
    }

    try {
      return await deliveryAPI.calculateFee(address)
    } catch (error) {
      return handleApiError(error, { data: { fee: 400, estimatedDays: 2 } })
    }
  }
}

// Wishlist Service
export const WishlistService = {
  async get() {
    if (USE_MOCK_DATA) {
      await simulateApiDelay()
      
      const wishlist = JSON.parse(localStorage.getItem('platypus-wishlist') || '[]')
      return { data: wishlist }
    }

    try {
      return await userAPI.getWishlist()
    } catch (error) {
      return handleApiError(error, { data: [] })
    }
  },

  async add(productId) {
    if (USE_MOCK_DATA) {
      await simulateApiDelay()
      
      const wishlist = JSON.parse(localStorage.getItem('platypus-wishlist') || '[]')
      if (!wishlist.includes(productId)) {
        wishlist.push(productId)
        localStorage.setItem('platypus-wishlist', JSON.stringify(wishlist))
      }
      
      return { data: { success: true, message: 'Added to wishlist' } }
    }

    try {
      return await userAPI.addToWishlist(productId)
    } catch (error) {
      handleApiError(error)
    }
  },

  async remove(productId) {
    if (USE_MOCK_DATA) {
      await simulateApiDelay()
      
      const wishlist = JSON.parse(localStorage.getItem('platypus-wishlist') || '[]')
      const updated = wishlist.filter(id => id !== productId)
      localStorage.setItem('platypus-wishlist', JSON.stringify(updated))
      
      return { data: { success: true, message: 'Removed from wishlist' } }
    }

    try {
      return await userAPI.removeFromWishlist(productId)
    } catch (error) {
      handleApiError(error)
    }
  }
}

// Configuration helper
export const APIConfig = {
  useMockData: USE_MOCK_DATA,
  toggleMockData: () => {
    localStorage.setItem('platypus-use-mock', (!USE_MOCK_DATA).toString())
    window.location.reload()
  },
  
  isOnline: () => navigator.onLine,
  
  getApiStatus: async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/health`, {
        method: 'GET',
        timeout: 3000
      })
      return response.ok
    } catch {
      return false
    }
  }
}

export default {
  Products: ProductsService,
  Auth: AuthService,
  Orders: OrdersService,
  Payments: PaymentsService,
  Delivery: DeliveryService,
  Wishlist: WishlistService,
  Config: APIConfig
}
