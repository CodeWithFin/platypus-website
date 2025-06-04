import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Edit3, 
  Gift, 
  Clock, 
  Package,
  CreditCard,
  LogOut,
  Camera
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { formatPrice, formatPhoneNumber } from '@/utils/helpers'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, isAuthenticated, updateProfile, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || ''
  })

  // Mock orders data
  const mockOrders = [
    {
      id: 'ORD-001',
      date: '2024-12-01',
      status: 'delivered',
      total: 3500,
      items: ['Beefeater Gin', 'Gordon\'s Gin']
    },
    {
      id: 'ORD-002',
      date: '2024-11-28',
      status: 'processing',
      total: 2800,
      items: ['Jameson Whisky']
    }
  ]

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <User className="mx-auto h-12 w-12 text-platypus-green-500" />
            <h2 className="mt-6 text-3xl font-bold text-apple-gray-900 dark:text-apple-gray-100">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-apple-gray-600 dark:text-apple-gray-400">
              Please sign in to view your profile
            </p>
          </div>
        </div>
      </div>
    )
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSaveProfile = () => {
    updateProfile(formData)
    setIsEditing(false)
    toast.success('Profile updated successfully!')
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'loyalty', label: 'Loyalty', icon: Gift }
  ]

  return (
    <div className="min-h-screen bg-apple-gray-50 dark:bg-apple-gray-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white dark:bg-apple-gray-900 rounded-2xl shadow-apple p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 bg-platypus-green-500 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <button className="absolute -bottom-1 -right-1 bg-platypus-gold-400 rounded-full p-2 hover:bg-platypus-gold-500 transition-colors">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-apple-gray-900 dark:text-apple-gray-100">
                {user.name}
              </h1>
              <p className="text-apple-gray-600 dark:text-apple-gray-400">
                {user.email}
              </p>
              <div className="flex items-center mt-2">
                <Gift className="w-4 h-4 text-platypus-gold-400 mr-1" />
                <span className="text-sm text-platypus-gold-600 dark:text-platypus-gold-400 font-medium">
                  {user.loyaltyPoints || 0} Loyalty Points
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-apple-gray-200 dark:bg-apple-gray-800 rounded-xl p-1 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-apple-gray-700 text-platypus-green-600 shadow-sm'
                    : 'text-apple-gray-600 dark:text-apple-gray-400 hover:text-apple-gray-900 dark:hover:text-apple-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-apple-gray-900 rounded-2xl shadow-apple p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-apple-gray-900 dark:text-apple-gray-100">
                Personal Information
              </h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-2 text-platypus-green-600 hover:text-platypus-green-700 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>{isEditing ? 'Cancel' : 'Edit'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-apple-gray-700 dark:text-apple-gray-300 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-apple-gray-300 dark:border-apple-gray-600 rounded-lg focus:ring-2 focus:ring-platypus-green-500 focus:border-transparent bg-white dark:bg-apple-gray-800 text-apple-gray-900 dark:text-apple-gray-100"
                  />
                ) : (
                  <p className="text-apple-gray-900 dark:text-apple-gray-100">{user.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-apple-gray-700 dark:text-apple-gray-300 mb-2">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-apple-gray-300 dark:border-apple-gray-600 rounded-lg focus:ring-2 focus:ring-platypus-green-500 focus:border-transparent bg-white dark:bg-apple-gray-800 text-apple-gray-900 dark:text-apple-gray-100"
                  />
                ) : (
                  <p className="text-apple-gray-900 dark:text-apple-gray-100">{user.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-apple-gray-700 dark:text-apple-gray-300 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-apple-gray-300 dark:border-apple-gray-600 rounded-lg focus:ring-2 focus:ring-platypus-green-500 focus:border-transparent bg-white dark:bg-apple-gray-800 text-apple-gray-900 dark:text-apple-gray-100"
                  />
                ) : (
                  <p className="text-apple-gray-900 dark:text-apple-gray-100">
                    {formatPhoneNumber(user.phone)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-apple-gray-700 dark:text-apple-gray-300 mb-2">
                  Date of Birth
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-apple-gray-300 dark:border-apple-gray-600 rounded-lg focus:ring-2 focus:ring-platypus-green-500 focus:border-transparent bg-white dark:bg-apple-gray-800 text-apple-gray-900 dark:text-apple-gray-100"
                  />
                ) : (
                  <p className="text-apple-gray-900 dark:text-apple-gray-100">
                    {user.dateOfBirth || 'Not provided'}
                  </p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-apple-gray-600 dark:text-apple-gray-400 hover:text-apple-gray-800 dark:hover:text-apple-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="btn-primary"
                >
                  Save Changes
                </button>
              </div>
            )}

            {/* Addresses Section */}
            <div className="mt-8 pt-8 border-t border-apple-gray-200 dark:border-apple-gray-700">
              <h3 className="text-lg font-medium text-apple-gray-900 dark:text-apple-gray-100 mb-4">
                Delivery Addresses
              </h3>
              {user.addresses && user.addresses.length > 0 ? (
                <div className="space-y-4">
                  {user.addresses.map((address) => (
                    <div
                      key={address.id}
                      className="border border-apple-gray-200 dark:border-apple-gray-700 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-apple-gray-900 dark:text-apple-gray-100">
                            {address.name}
                          </h4>
                          <p className="text-apple-gray-600 dark:text-apple-gray-400 mt-1">
                            {address.street}, {address.city}, {address.county}
                          </p>
                          <p className="text-apple-gray-600 dark:text-apple-gray-400">
                            {formatPhoneNumber(address.phone)}
                          </p>
                        </div>
                        <button className="text-platypus-green-600 hover:text-platypus-green-700 transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-apple-gray-600 dark:text-apple-gray-400">
                  No addresses added yet
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-apple-gray-900 rounded-2xl shadow-apple p-6"
          >
            <h2 className="text-xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-6">
              Order History
            </h2>
            <div className="space-y-4">
              {mockOrders.map((order) => (
                <div
                  key={order.id}
                  className="border border-apple-gray-200 dark:border-apple-gray-700 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-apple-gray-900 dark:text-apple-gray-100">
                        Order #{order.id}
                      </h3>
                      <p className="text-apple-gray-600 dark:text-apple-gray-400 text-sm mt-1">
                        {new Date(order.date).toLocaleDateString()}
                      </p>
                      <p className="text-apple-gray-600 dark:text-apple-gray-400 text-sm">
                        {order.items.join(', ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-apple-gray-900 dark:text-apple-gray-100">
                        {formatPrice(order.total)}
                      </p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        order.status === 'delivered' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Loyalty Tab */}
        {activeTab === 'loyalty' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-apple-gray-900 rounded-2xl shadow-apple p-6"
          >
            <h2 className="text-xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-6">
              Loyalty Program
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-platypus-green-500 to-platypus-gold-400 rounded-xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Current Points</h3>
                <p className="text-3xl font-bold">{user.loyaltyPoints || 0}</p>
                <p className="text-sm opacity-90 mt-2">
                  Earn 1 point for every KES 100 spent
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="font-medium text-apple-gray-900 dark:text-apple-gray-100">
                  Rewards Available
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 border border-apple-gray-200 dark:border-apple-gray-700 rounded-lg">
                    <span className="text-apple-gray-900 dark:text-apple-gray-100">
                      Free Delivery
                    </span>
                    <span className="text-platypus-green-600">50 points</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border border-apple-gray-200 dark:border-apple-gray-700 rounded-lg">
                    <span className="text-apple-gray-900 dark:text-apple-gray-100">
                      10% Discount
                    </span>
                    <span className="text-platypus-green-600">100 points</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Logout Button */}
        <div className="mt-8 text-center">
          <button
            onClick={logout}
            className="inline-flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile
