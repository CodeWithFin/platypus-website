import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { AuthService } from '../services/apiService'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false
      }
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false
      }
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }
    
    default:
      return state
  }
}

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    // Check for existing session on mount
    const token = localStorage.getItem('platypus-auth-token')
    const userData = localStorage.getItem('platypus-user-data')
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData)
        dispatch({ type: 'LOGIN', payload: user })
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('platypus-auth-token')
        localStorage.removeItem('platypus-user-data')
      }
    }
    
    dispatch({ type: 'SET_LOADING', payload: false })
  }, [])

  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      const response = await AuthService.login({ email, password })
      
      if (response.data.user) {
        dispatch({ type: 'LOGIN', payload: response.data.user })
        return { success: true, user: response.data.user }
      }
      
      return { success: false, error: 'Login failed' }
    } catch (error) {
      console.error('Login error:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Login failed'
      return { success: false, error: errorMessage }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const register = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      const response = await AuthService.register(userData)
      
      if (response.data.user) {
        dispatch({ type: 'LOGIN', payload: response.data.user })
        return { success: true, user: response.data.user }
      }
      
      return { success: false, error: 'Registration failed' }
    } catch (error) {
      console.error('Registration error:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed'
      return { success: false, error: errorMessage }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const logout = async () => {
    try {
      await AuthService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      dispatch({ type: 'LOGOUT' })
    }
  }

  const updateProfile = (userData) => {
    const updatedUser = { ...state.user, ...userData }
    localStorage.setItem('platypus-user-data', JSON.stringify(updatedUser))
    dispatch({ type: 'LOGIN', payload: updatedUser })
  }

  const value = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    login,
    loginUser: login, // Alias for compatibility
    register,
    registerUser: register, // Alias for compatibility
    logout,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
