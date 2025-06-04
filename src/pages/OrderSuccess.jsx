import React, { useEffect, useState } from 'react'
import { Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  Package, 
  Truck, 
  MapPin, 
  Calendar,
  Phone,
  Mail,
  Download,
  Share2,
  ArrowLeft,
  Star,
  Gift
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { formatPrice, formatPhoneNumber } from '../utils/helpers'
import toast from 'react-hot-toast'

const OrderSuccess = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { clearCart } = useCart()
  const { user } = useAuth()
  
  const [orderData, setOrderData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const orderId = searchParams.get('orderId')
  const paymentId = searchParams.get('paymentId')
  const email = searchParams.get('email')
  const phone = searchParams.get('phone')

  useEffect(() => {
    // Check if we have order data from navigation state first
    if (location.state?.order) {
      setOrderData(location.state.order)
      setIsLoading(false)
      return
    }

    // If no order ID in URL, redirect to home
    if (!orderId) {
      navigate('/', { replace: true })
      return
    }

    // Simulate fetching order data
    const fetchOrderData = async () => {
      try {
        // Check if order exists in localStorage first
        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]')
        const foundOrder = existingOrders.find(order => order.id === orderId)
        
        if (foundOrder) {
          setOrderData(foundOrder)
        } else {
          // Fallback to mock data if order not found
          const mockOrderData = {
            id: orderId,
            number: `PL-${Date.now().toString().slice(-6)}`,
            status: 'confirmed',
            paymentId: paymentId,
            paymentMethod: 'M-Pesa',
            paymentStatus: 'completed',
            total: parseFloat(localStorage.getItem('orderTotal') || '0'),
            subtotal: parseFloat(localStorage.getItem('orderSubtotal') || '0'),
            deliveryFee: parseFloat(localStorage.getItem('deliveryFee') || '0'),
            discount: parseFloat(localStorage.getItem('orderDiscount') || '0'),
            items: JSON.parse(localStorage.getItem('orderItems') || '[]'),
            customer: {
              name: user?.name || 'Guest Customer',
              email: user?.email || email,
              phone: user?.phone || phone,
            },
            delivery: {
              address: localStorage.getItem('deliveryAddress') || '',
              city: localStorage.getItem('deliveryCity') || 'Nakuru',
              instructions: localStorage.getItem('deliveryInstructions') || '',
              estimatedDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
              timeSlot: localStorage.getItem('deliveryTimeSlot') || '9:00 AM - 12:00 PM'
            },
            placedAt: new Date().toISOString(),
            estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
          }

          setOrderData(mockOrderData)
        }
        
        // Clear cart after successful order
        clearCart()
        
        // Clear temporary order data from localStorage
        localStorage.removeItem('orderTotal')
        localStorage.removeItem('orderSubtotal')
        localStorage.removeItem('deliveryFee')
        localStorage.removeItem('orderDiscount')
        localStorage.removeItem('orderItems')
        localStorage.removeItem('deliveryAddress')
        localStorage.removeItem('deliveryCity')
        localStorage.removeItem('deliveryInstructions')
        localStorage.removeItem('deliveryTimeSlot')
        
      } catch (error) {
        console.error('Error fetching order data:', error)
        toast.error('Error loading order details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderData()
  }, [orderId, paymentId, email, phone, navigate, clearCart, user, location.state])

  const handleDownloadReceipt = () => {
    toast.success('Receipt download started')
    // In a real app, this would generate and download a PDF receipt
  }

  const handleShareOrder = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Platypus Liquor Order',
          text: `I just placed an order (#${orderData?.number}) with Platypus Liquor!`,
          url: window.location.href
        })
      } catch (error) {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(window.location.href)
        toast.success('Order link copied to clipboard!')
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Order link copied to clipboard!')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-platypus-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-apple-gray-600 dark:text-apple-gray-400">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Package className="w-16 h-16 text-apple-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-apple-gray-900 dark:text-apple-gray-100 mb-4">
            Order Not Found
          </h2>
          <p className="text-apple-gray-600 dark:text-apple-gray-400 mb-8">
            We couldn't find the order you're looking for.
          </p>
          <Link to="/" className="btn-primary">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-platypus-gold-50 dark:from-apple-gray-950 dark:via-black dark:to-apple-gray-900">
      {/* Success Header */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Link
              to="/"
              className="inline-flex items-center text-apple-gray-600 dark:text-apple-gray-400 hover:text-platypus-green-600 dark:hover:text-platypus-green-400 mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-apple-gray-900 dark:text-apple-gray-100 mb-4">
              Order Confirmed!
            </h1>
            
            <p className="text-xl text-apple-gray-600 dark:text-apple-gray-400 mb-2">
              Thank you for your order, {orderData.customer.name}!
            </p>
            
            <p className="text-lg text-apple-gray-500 dark:text-apple-gray-500 mb-8">
              Order #{orderData.number} • Placed on {new Date(orderData.placedAt).toLocaleDateString()}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleDownloadReceipt}
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Download Receipt</span>
              </button>
              
              <button
                onClick={handleShareOrder}
                className="btn-secondary flex items-center justify-center space-x-2"
              >
                <Share2 className="w-5 h-5" />
                <span>Share Order</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Order Details */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-2 space-y-8">
              {/* Order Status Timeline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="card p-6"
              >
                <h2 className="text-2xl font-bold text-apple-gray-900 dark:text-apple-gray-100 mb-6">
                  Order Status
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-apple-gray-900 dark:text-apple-gray-100">
                        Order Confirmed
                      </h3>
                      <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400">
                        Your order has been received and confirmed
                      </p>
                    </div>
                    <span className="text-sm text-apple-gray-500 dark:text-apple-gray-400">
                      Just now
                    </span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-apple-gray-900 dark:text-apple-gray-100">
                        Preparing Order
                      </h3>
                      <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400">
                        Your items are being carefully prepared
                      </p>
                    </div>
                    <span className="text-sm text-apple-gray-500 dark:text-apple-gray-400">
                      Within 2 hours
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 opacity-50">
                    <div className="w-10 h-10 bg-apple-gray-100 dark:bg-apple-gray-700 rounded-full flex items-center justify-center">
                      <Truck className="w-6 h-6 text-apple-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-apple-gray-900 dark:text-apple-gray-100">
                        Out for Delivery
                      </h3>
                      <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400">
                        On the way to your location
                      </p>
                    </div>
                    <span className="text-sm text-apple-gray-500 dark:text-apple-gray-400">
                      {orderData.delivery.timeSlot}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Order Items */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="card p-6"
              >
                <h2 className="text-2xl font-bold text-apple-gray-900 dark:text-apple-gray-100 mb-6">
                  Order Items ({orderData.items.length})
                </h2>
                
                <div className="space-y-4">
                  {orderData.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-apple-gray-50 dark:bg-apple-gray-800 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-apple-gray-900 dark:text-apple-gray-100">
                          {item.name}
                        </h4>
                        <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400">
                          {item.brand} • Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-apple-gray-900 dark:text-apple-gray-100">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <p className="text-sm text-apple-gray-500 dark:text-apple-gray-400">
                          {formatPrice(item.price)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Order Summary & Delivery Info */}
            <div className="space-y-8">
              {/* Payment Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="card p-6"
              >
                <h3 className="text-xl font-bold text-apple-gray-900 dark:text-apple-gray-100 mb-4">
                  Payment Summary
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-apple-gray-600 dark:text-apple-gray-400">Subtotal</span>
                    <span className="text-apple-gray-900 dark:text-apple-gray-100">
                      {formatPrice(orderData.subtotal)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-apple-gray-600 dark:text-apple-gray-400">Delivery Fee</span>
                    <span className="text-apple-gray-900 dark:text-apple-gray-100">
                      {orderData.deliveryFee === 0 ? 'FREE' : formatPrice(orderData.deliveryFee)}
                    </span>
                  </div>
                  
                  {orderData.discount > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>Discount</span>
                      <span>-{formatPrice(orderData.discount)}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-apple-gray-200 dark:border-apple-gray-700 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-apple-gray-900 dark:text-apple-gray-100">Total</span>
                      <span className="text-apple-gray-900 dark:text-apple-gray-100">
                        {formatPrice(orderData.total)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-green-800 dark:text-green-300">
                      Payment Successful via {orderData.paymentMethod}
                    </span>
                  </div>
                  {orderData.paymentId && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      Payment ID: {orderData.paymentId}
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Delivery Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="card p-6"
              >
                <h3 className="text-xl font-bold text-apple-gray-900 dark:text-apple-gray-100 mb-4">
                  Delivery Information
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-platypus-green-600 dark:text-platypus-green-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-apple-gray-900 dark:text-apple-gray-100">
                        Delivery Address
                      </p>
                      <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400">
                        {orderData.delivery.address}
                      </p>
                      <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400">
                        {orderData.delivery.city}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-platypus-green-600 dark:text-platypus-green-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-apple-gray-900 dark:text-apple-gray-100">
                        Estimated Delivery
                      </p>
                      <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400">
                        {new Date(orderData.estimatedDelivery).toLocaleDateString()} • {orderData.delivery.timeSlot}
                      </p>
                    </div>
                  </div>

                  {orderData.delivery.instructions && (
                    <div className="flex items-start space-x-3">
                      <Package className="w-5 h-5 text-platypus-green-600 dark:text-platypus-green-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-apple-gray-900 dark:text-apple-gray-100">
                          Delivery Instructions
                        </p>
                        <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400">
                          {orderData.delivery.instructions}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="card p-6"
              >
                <h3 className="text-xl font-bold text-apple-gray-900 dark:text-apple-gray-100 mb-4">
                  Need Help?
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-platypus-green-600 dark:text-platypus-green-400" />
                    <div>
                      <p className="font-medium text-apple-gray-900 dark:text-apple-gray-100">
                        Call Us
                      </p>
                      <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400">
                        +254 712 345 678
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-platypus-green-600 dark:text-platypus-green-400" />
                    <div>
                      <p className="font-medium text-apple-gray-900 dark:text-apple-gray-100">
                        Email Support
                      </p>
                      <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400">
                        support@platypusliquor.co.ke
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  to="/profile"
                  className="block w-full mt-4 btn-secondary text-center"
                >
                  Track in My Orders
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Continue Shopping */}
      <section className="py-16 bg-apple-gray-50 dark:bg-apple-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Gift className="w-16 h-16 text-platypus-green-600 dark:text-platypus-green-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-apple-gray-900 dark:text-apple-gray-100 mb-4">
              Thank You for Choosing Platypus Liquor!
            </h2>
            <p className="text-xl text-apple-gray-600 dark:text-apple-gray-400 mb-8">
              We appreciate your business and look forward to serving you again.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link to="/products" className="btn-primary flex items-center justify-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Continue Shopping</span>
              </Link>
              
              <button
                onClick={() => {
                  toast.success('Thank you for your feedback!')
                }}
                className="btn-secondary flex items-center justify-center space-x-2"
              >
                <Star className="w-5 h-5" />
                <span>Rate Your Experience</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default OrderSuccess
