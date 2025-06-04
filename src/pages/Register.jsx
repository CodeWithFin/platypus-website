import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowLeft, Shield, CheckCircle, Star, Heart } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { validateKenyanPhone } from '../utils/helpers'
import toast from 'react-hot-toast'

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    agreeToTerms: false,
    subscribeNewsletter: true
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const { register: registerUser, user } = useAuth()
  const navigate = useNavigate()

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true })
    }
  }, [user, navigate])

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

    // Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters'
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required'
    } else if (!validateKenyanPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid Kenyan phone number (e.g., +254712345678)'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    // Age verification
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required'
    } else {
      const birthDate = new Date(formData.dateOfBirth)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      
      if (age < 18) {
        newErrors.dateOfBirth = 'You must be at least 18 years old to register'
      }
    }

    // Terms agreement
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)

    try {
      await registerUser({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        dateOfBirth: formData.dateOfBirth,
        subscribeNewsletter: formData.subscribeNewsletter
      })
      
      toast.success('Account created successfully! Welcome to Platypus Liquor!')
      navigate('/', { replace: true })
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.')
      setErrors({ submit: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const benefits = [
    {
      icon: Heart,
      title: 'Loyalty Rewards',
      description: 'Earn points on every purchase and unlock exclusive discounts'
    },
    {
      icon: Star,
      title: 'Premium Selection',
      description: 'Access to rare and premium spirits not available elsewhere'
    },
    {
      icon: Shield,
      title: 'Secure & Fast',
      description: 'Safe transactions with quick delivery across Kenya'
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
                Join{' '}
                <span className="text-gradient">
                  Platypus Liquor
                </span>{' '}
                Family
              </h1>
              <p className="text-xl text-apple-gray-600 dark:text-apple-gray-400 mb-8">
                Create your account and start enjoying Kenya's finest selection of premium spirits with exclusive member benefits.
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

          {/* Right Side - Registration Form */}
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
                  Create Account
                </h2>
                <p className="text-apple-gray-600 dark:text-apple-gray-400">
                  Join thousands of satisfied customers across Kenya
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
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-apple-gray-700 dark:text-apple-gray-300 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-platypus-green-500 focus:border-transparent bg-white dark:bg-apple-gray-800 text-apple-gray-900 dark:text-apple-gray-100 transition-colors ${
                        errors.firstName
                          ? 'border-red-300 dark:border-red-600'
                          : 'border-apple-gray-300 dark:border-apple-gray-600'
                      }`}
                      placeholder="Enter first name"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-apple-gray-700 dark:text-apple-gray-300 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-platypus-green-500 focus:border-transparent bg-white dark:bg-apple-gray-800 text-apple-gray-900 dark:text-apple-gray-100 transition-colors ${
                        errors.lastName
                          ? 'border-red-300 dark:border-red-600'
                          : 'border-apple-gray-300 dark:border-apple-gray-600'
                      }`}
                      placeholder="Enter last name"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
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

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-apple-gray-700 dark:text-apple-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-platypus-green-500 focus:border-transparent bg-white dark:bg-apple-gray-800 text-apple-gray-900 dark:text-apple-gray-100 transition-colors ${
                      errors.phone
                        ? 'border-red-300 dark:border-red-600'
                        : 'border-apple-gray-300 dark:border-apple-gray-600'
                    }`}
                    placeholder="+254 712 345 678"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-apple-gray-700 dark:text-apple-gray-300 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    max={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-platypus-green-500 focus:border-transparent bg-white dark:bg-apple-gray-800 text-apple-gray-900 dark:text-apple-gray-100 transition-colors ${
                      errors.dateOfBirth
                        ? 'border-red-300 dark:border-red-600'
                        : 'border-apple-gray-300 dark:border-apple-gray-600'
                    }`}
                  />
                  {errors.dateOfBirth && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        placeholder="Create password"
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

                  <div>
                    <label className="block text-sm font-medium text-apple-gray-700 dark:text-apple-gray-300 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-platypus-green-500 focus:border-transparent bg-white dark:bg-apple-gray-800 text-apple-gray-900 dark:text-apple-gray-100 transition-colors ${
                          errors.confirmPassword
                            ? 'border-red-300 dark:border-red-600'
                            : 'border-apple-gray-300 dark:border-apple-gray-600'
                        }`}
                        placeholder="Confirm password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-300"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-4">
                  <div>
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                        className={`w-4 h-4 text-platypus-green-600 border-apple-gray-300 dark:border-apple-gray-600 rounded focus:ring-platypus-green-500 bg-white dark:bg-apple-gray-800 mt-1 ${
                          errors.agreeToTerms ? 'border-red-300 dark:border-red-600' : ''
                        }`}
                      />
                      <span className="ml-2 text-sm text-apple-gray-600 dark:text-apple-gray-400">
                        I agree to the{' '}
                        <Link to="/terms" className="text-platypus-green-600 dark:text-platypus-green-400 hover:underline">
                          Terms and Conditions
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy" className="text-platypus-green-600 dark:text-platypus-green-400 hover:underline">
                          Privacy Policy
                        </Link>
                      </span>
                    </label>
                    {errors.agreeToTerms && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.agreeToTerms}
                      </p>
                    )}
                  </div>

                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="subscribeNewsletter"
                      checked={formData.subscribeNewsletter}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-platypus-green-600 border-apple-gray-300 dark:border-apple-gray-600 rounded focus:ring-platypus-green-500 bg-white dark:bg-apple-gray-800 mt-1"
                    />
                    <span className="ml-2 text-sm text-apple-gray-600 dark:text-apple-gray-400">
                      Subscribe to our newsletter for exclusive offers and updates
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-apple-gray-600 dark:text-apple-gray-400">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-platypus-green-600 dark:text-platypus-green-400 hover:text-platypus-green-700 dark:hover:text-platypus-green-300 font-medium"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>

              {/* Age Verification Notice */}
              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <p className="text-amber-800 dark:text-amber-300 text-sm text-center">
                  <Shield className="w-4 h-4 inline mr-1" />
                  Must be 18+ to purchase alcohol. ID verification required upon delivery.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Register
