import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowLeft, Shield, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const { login, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/'
      navigate(from, { replace: true })
    }
  }, [user, navigate, location])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)

    try {
      await login(formData.email, formData.password, formData.rememberMe)
      toast.success('Welcome back!')
      
      const from = location.state?.from?.pathname || '/'
      navigate(from, { replace: true })
    } catch (error) {
      toast.error(error.message || 'Login failed. Please try again.')
      setErrors({ submit: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const benefits = [
    {
      icon: Shield,
      title: 'Secure Account',
      description: 'Your personal information is protected with industry-standard encryption'
    },
    {
      icon: CheckCircle,
      title: 'Fast Checkout',
      description: 'Save your delivery details for quicker future purchases'
    },
    {
      icon: Shield,
      title: 'Order History',
      description: 'Track your orders and easily reorder your favorite products'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-platypus-green-50 via-white to-platypus-gold-50 dark:from-apple-gray-950 dark:via-black dark:to-apple-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block"
          >
            <div className="max-w-md">
              <h1 className="text-4xl font-bold text-apple-gray-900 dark:text-apple-gray-100 mb-6">
                Welcome Back to{' '}
                <span className="text-gradient">
                  Platypus Liquor
                </span>
              </h1>
              <p className="text-xl text-apple-gray-600 dark:text-apple-gray-400 mb-8">
                Sign in to your account and continue enjoying premium spirits delivered to your doorstep.
              </p>

              <div className="space-y-6">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                      className="flex items-start space-x-4"
                    >
                      <div className="w-12 h-12 bg-platypus-green-100 dark:bg-platypus-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-platypus-green-600 dark:text-platypus-green-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-1">
                          {benefit.title}
                        </h3>
                        <p className="text-apple-gray-600 dark:text-apple-gray-400">
                          {benefit.description}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="card p-8 max-w-md mx-auto lg:max-w-none">
              {/* Back Button */}
              <Link
                to="/"
                className="inline-flex items-center text-apple-gray-600 dark:text-apple-gray-400 hover:text-platypus-green-600 dark:hover:text-platypus-green-400 mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-apple-gray-900 dark:text-apple-gray-100 mb-2">
                  Sign In
                </h2>
                <p className="text-apple-gray-600 dark:text-apple-gray-400">
                  Enter your credentials to access your account
                </p>
              </div>

              {errors.submit && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    {errors.submit}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-apple-gray-700 dark:text-apple-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-platypus-green-500 focus:border-transparent bg-white dark:bg-apple-gray-800 text-apple-gray-900 dark:text-apple-gray-100 transition-colors ${
                      errors.email
                        ? 'border-red-300 dark:border-red-600'
                        : 'border-apple-gray-300 dark:border-apple-gray-600'
                    }`}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-apple-gray-700 dark:text-apple-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-platypus-green-500 focus:border-transparent bg-white dark:bg-apple-gray-800 text-apple-gray-900 dark:text-apple-gray-100 transition-colors ${
                        errors.password
                          ? 'border-red-300 dark:border-red-600'
                          : 'border-apple-gray-300 dark:border-apple-gray-600'
                      }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-300"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-platypus-green-600 border-apple-gray-300 dark:border-apple-gray-600 rounded focus:ring-platypus-green-500 bg-white dark:bg-apple-gray-800"
                    />
                    <span className="ml-2 text-sm text-apple-gray-600 dark:text-apple-gray-400">
                      Remember me
                    </span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-platypus-green-600 dark:text-platypus-green-400 hover:text-platypus-green-700 dark:hover:text-platypus-green-300"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-apple-gray-600 dark:text-apple-gray-400">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="text-platypus-green-600 dark:text-platypus-green-400 hover:text-platypus-green-700 dark:hover:text-platypus-green-300 font-medium"
                  >
                    Create one now
                  </Link>
                </p>
              </div>

              {/* Age Verification Notice */}
              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <p className="text-amber-800 dark:text-amber-300 text-sm text-center">
                  <Shield className="w-4 h-4 inline mr-1" />
                  Must be 18+ to purchase alcohol. ID verification required.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Login
