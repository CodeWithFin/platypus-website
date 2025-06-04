import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  CreditCardIcon,
  DevicePhoneMobileIcon,
  TruckIcon,
  MapPinIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { OrdersService, PaymentsService } from '../services/apiService'
import { formatPrice, formatPhoneNumber, validateKenyanPhone } from '../utils/helpers'
import toast from 'react-hot-toast'

const Checkout = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('mpesa')
  const [formData, setFormData] = useState({
    // Customer Info
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    
    // Delivery Info
    address: '',
    city: 'Nairobi',
    county: 'Nairobi',
    deliveryInstructions: '',
    
    // Payment Info
    mpesaPhone: user?.phone || '',
    
    // Age Verification
    ageVerified: false,
    
    // Delivery Options
    deliveryOption: 'standard'
  })

  const [errors, setErrors] = useState({})
  const [ageVerificationStep, setAgeVerificationStep] = useState(false)

  const deliveryOptions = [
    {
      id: 'standard',
      name: 'Standard Delivery',
      description: '2-3 business days',
      price: 200,
      icon: TruckIcon
    },
    {
      id: 'express',
      name: 'Express Delivery',
      description: 'Next business day',
      price: 500,
      icon: TruckIcon
    },
    {
      id: 'same-day',
      name: 'Same-Day Delivery',
      description: 'Within 4-6 hours (Nairobi only)',
      price: 800,
      icon: TruckIcon
    }
  ]

  const kenyanCounties = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi',
    'Kitale', 'Garissa', 'Kakamega', 'Nyeri', 'Machakos', 'Meru', 'Embu'
  ]

  const subtotal = getTotalPrice()
  const selectedDelivery = deliveryOptions.find(option => option.id === formData.deliveryOption)
  const deliveryFee = subtotal >= 3000 && formData.deliveryOption === 'standard' ? 0 : selectedDelivery?.price || 0
  const totalAmount = subtotal + deliveryFee

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart')
    }
  }, [cartItems, navigate])

  useEffect(() => {
    // Check if any items require age verification
    const requiresAgeVerification = cartItems.some(item => item.alcoholContent > 0)
    if (requiresAgeVerification && !formData.ageVerified) {
      setAgeVerificationStep(true)
    }
  }, [cartItems, formData.ageVerified])

  const validateStep = (step) => {
    const newErrors = {}

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid'
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required'
      } else if (!validateKenyanPhone(formData.phone)) {
        newErrors.phone = 'Please enter a valid Kenyan phone number'
      }
    }

    if (step === 2) {
      if (!formData.address.trim()) newErrors.address = 'Address is required'
      if (!formData.city.trim()) newErrors.city = 'City is required'
    }

    if (step === 3) {
      if (paymentMethod === 'mpesa') {
        if (!formData.mpesaPhone.trim()) {
          newErrors.mpesaPhone = 'M-Pesa phone number is required'
        } else if (!validateKenyanPhone(formData.mpesaPhone)) {
          newErrors.mpesaPhone = 'Please enter a valid M-Pesa phone number'
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleAgeVerification = (isVerified) => {
    setFormData(prev => ({ ...prev, ageVerified: isVerified }))
    setAgeVerificationStep(false)
    if (!isVerified) {
      toast.error('Age verification is required to purchase alcoholic beverages')
      navigate('/cart')
    }
  }

  const handlePlaceOrder = async () => {
    if (!validateStep(3) || !formData.ageVerified) return

    setIsProcessing(true)

    try {
      // Create order data
      const orderData = {
        items: cartItems,
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone
        },
        delivery: {
          address: formData.address,
          city: formData.city,
          county: formData.county,
          instructions: formData.deliveryInstructions,
          option: formData.deliveryOption
        },
        payment: {
          method: paymentMethod,
          phone: formData.mpesaPhone,
          amount: totalAmount
        },
        subtotal,
        deliveryFee,
        totalAmount
      }

      // Create order through API service
      const orderResponse = await OrdersService.create(orderData)
      
      if (!orderResponse.data) {
        throw new Error('Failed to create order')
      }

      const createdOrder = orderResponse.data

      // Process payment if M-Pesa
      if (paymentMethod === 'mpesa') {
        toast.success('M-Pesa payment request sent to your phone!')
        
        const paymentResponse = await PaymentsService.initiateMpesa({
          orderId: createdOrder.id,
          phone: formData.mpesaPhone,
          amount: totalAmount
        })
        
        if (paymentResponse.data.checkoutId) {
          // Simulate payment confirmation check
          await new Promise(resolve => setTimeout(resolve, 2000))
          
          const statusResponse = await PaymentsService.checkMpesaStatus(paymentResponse.data.checkoutId)
          
          if (statusResponse.data.status !== 'completed') {
            throw new Error('Payment was not completed')
          }
        }
      }

      // Store order data temporarily for order success page
      localStorage.setItem('orderTotal', totalAmount.toString())
      localStorage.setItem('orderSubtotal', subtotal.toString())
      localStorage.setItem('deliveryFee', deliveryFee.toString())
      localStorage.setItem('orderItems', JSON.stringify(cartItems))
      localStorage.setItem('deliveryAddress', formData.address)
      localStorage.setItem('deliveryCity', formData.city)
      localStorage.setItem('deliveryInstructions', formData.deliveryInstructions)
      localStorage.setItem('deliveryTimeSlot', selectedDelivery?.description || '2-3 business days')

      // Clear cart
      clearCart()

      // Generate payment ID for reference
      const paymentId = `MP${Date.now()}`

      // Navigate to success page with order and payment IDs
      navigate(`/order-success?orderId=${createdOrder.id}&paymentId=${paymentId}&email=${formData.email}&phone=${formData.phone}`)

      toast.success('Order placed successfully!', {
        icon: '🎉',
      })

    } catch (error) {
      console.error('Order processing failed:', error)
      toast.error(error.message || 'Failed to process order. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const steps = [
    { number: 1, title: 'Customer Info', icon: UserIcon },
    { number: 2, title: 'Delivery', icon: TruckIcon },
    { number: 3, title: 'Payment', icon: CreditCardIcon },
    { number: 4, title: 'Review', icon: CheckCircleIcon }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8 max-w-6xl"
    >
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.number
                  ? 'bg-platypus-green border-platypus-green text-white'
                  : 'border-apple-gray-300 text-apple-gray-400'
              }`}>
                {currentStep > step.number ? (
                  <CheckCircleIcon className="w-6 h-6" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                currentStep >= step.number
                  ? 'text-platypus-green'
                  : 'text-apple-gray-400'
              }`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`mx-4 h-0.5 w-16 ${
                  currentStep > step.number
                    ? 'bg-platypus-green'
                    : 'bg-apple-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-apple-gray-800 rounded-2xl p-8 border border-apple-gray-200 dark:border-apple-gray-700"
            >
              {/* Step 1: Customer Information */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-apple-gray-900 dark:text-white mb-6">
                    Customer Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-apple-gray-700 dark:text-apple-gray-300 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-apple-gray-700 focus:ring-2 focus:ring-platypus-green focus:border-transparent ${
                          errors.firstName ? 'border-red-500' : 'border-apple-gray-300 dark:border-apple-gray-600'
                        }`}
                        placeholder="Enter your first name"
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-apple-gray-700 dark:text-apple-gray-300 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-apple-gray-700 focus:ring-2 focus:ring-platypus-green focus:border-transparent ${
                          errors.lastName ? 'border-red-500' : 'border-apple-gray-300 dark:border-apple-gray-600'
                        }`}
                        placeholder="Enter your last name"
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-apple-gray-700 dark:text-apple-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-apple-gray-700 focus:ring-2 focus:ring-platypus-green focus:border-transparent ${
                          errors.email ? 'border-red-500' : 'border-apple-gray-300 dark:border-apple-gray-600'
                        }`}
                        placeholder="Enter your email"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-apple-gray-700 dark:text-apple-gray-300 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-apple-gray-700 focus:ring-2 focus:ring-platypus-green focus:border-transparent ${
                          errors.phone ? 'border-red-500' : 'border-apple-gray-300 dark:border-apple-gray-600'
                        }`}
                        placeholder="+254 7XX XXX XXX"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Delivery Information */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-apple-gray-900 dark:text-white mb-6">
                    Delivery Information
                  </h2>
                  
                  {/* Delivery Options */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-apple-gray-700 dark:text-apple-gray-300 mb-3">
                      Delivery Option
                    </label>
                    <div className="space-y-3">
                      {deliveryOptions.map((option) => (
                        <label
                          key={option.id}
                          className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                            formData.deliveryOption === option.id
                              ? 'border-platypus-green bg-platypus-green/5'
                              : 'border-apple-gray-300 dark:border-apple-gray-600 hover:border-platypus-green/50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="deliveryOption"
                            value={option.id}
                            checked={formData.deliveryOption === option.id}
                            onChange={(e) => handleInputChange('deliveryOption', e.target.value)}
                            className="sr-only"
                          />
                          <option.icon className="w-6 h-6 text-platypus-green mr-3" />
                          <div className="flex-1">
                            <div className="font-medium text-apple-gray-900 dark:text-white">
                              {option.name}
                            </div>
                            <div className="text-sm text-apple-gray-600 dark:text-apple-gray-300">
                              {option.description}
                            </div>
                          </div>
                          <div className="font-medium text-platypus-green">
                            {subtotal >= 3000 && option.id === 'standard' ? 'FREE' : formatPrice(option.price)}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-apple-gray-700 dark:text-apple-gray-300 mb-2">
                        Delivery Address *
                      </label>
                      <textarea
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        rows={3}
                        className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-apple-gray-700 focus:ring-2 focus:ring-platypus-green focus:border-transparent ${
                          errors.address ? 'border-red-500' : 'border-apple-gray-300 dark:border-apple-gray-600'
                        }`}
                        placeholder="Enter your full delivery address"
                      />
                      {errors.address && (
                        <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-apple-gray-700 dark:text-apple-gray-300 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-apple-gray-700 focus:ring-2 focus:ring-platypus-green focus:border-transparent ${
                          errors.city ? 'border-red-500' : 'border-apple-gray-300 dark:border-apple-gray-600'
                        }`}
                        placeholder="Enter your city"
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-apple-gray-700 dark:text-apple-gray-300 mb-2">
                        County
                      </label>
                      <select
                        value={formData.county}
                        onChange={(e) => handleInputChange('county', e.target.value)}
                        className="w-full px-4 py-3 border border-apple-gray-300 dark:border-apple-gray-600 rounded-lg bg-white dark:bg-apple-gray-700 focus:ring-2 focus:ring-platypus-green focus:border-transparent"
                      >
                        {kenyanCounties.map((county) => (
                          <option key={county} value={county}>{county}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-apple-gray-700 dark:text-apple-gray-300 mb-2">
                        Delivery Instructions (Optional)
                      </label>
                      <textarea
                        value={formData.deliveryInstructions}
                        onChange={(e) => handleInputChange('deliveryInstructions', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-3 border border-apple-gray-300 dark:border-apple-gray-600 rounded-lg bg-white dark:bg-apple-gray-700 focus:ring-2 focus:ring-platypus-green focus:border-transparent"
                        placeholder="Any special delivery instructions..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-apple-gray-900 dark:text-white mb-6">
                    Payment Method
                  </h2>
                  
                  <div className="space-y-4 mb-6">
                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === 'mpesa'
                        ? 'border-platypus-green bg-platypus-green/5'
                        : 'border-apple-gray-300 dark:border-apple-gray-600'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="mpesa"
                        checked={paymentMethod === 'mpesa'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="sr-only"
                      />
                      <DevicePhoneMobileIcon className="w-6 h-6 text-green-600 mr-3" />
                      <div>
                        <div className="font-medium text-apple-gray-900 dark:text-white">M-Pesa</div>
                        <div className="text-sm text-apple-gray-600 dark:text-apple-gray-300">
                          Pay securely with M-Pesa mobile money
                        </div>
                      </div>
                    </label>

                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors opacity-50 ${
                      paymentMethod === 'card'
                        ? 'border-platypus-green bg-platypus-green/5'
                        : 'border-apple-gray-300 dark:border-apple-gray-600'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        disabled
                        className="sr-only"
                      />
                      <CreditCardIcon className="w-6 h-6 text-apple-gray-400 mr-3" />
                      <div>
                        <div className="font-medium text-apple-gray-900 dark:text-white">Credit/Debit Card</div>
                        <div className="text-sm text-apple-gray-600 dark:text-apple-gray-300">
                          Coming soon
                        </div>
                      </div>
                    </label>
                  </div>

                  {paymentMethod === 'mpesa' && (
                    <div>
                      <label className="block text-sm font-medium text-apple-gray-700 dark:text-apple-gray-300 mb-2">
                        M-Pesa Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.mpesaPhone}
                        onChange={(e) => handleInputChange('mpesaPhone', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-apple-gray-700 focus:ring-2 focus:ring-platypus-green focus:border-transparent ${
                          errors.mpesaPhone ? 'border-red-500' : 'border-apple-gray-300 dark:border-apple-gray-600'
                        }`}
                        placeholder="+254 7XX XXX XXX"
                      />
                      {errors.mpesaPhone && (
                        <p className="mt-1 text-sm text-red-500">{errors.mpesaPhone}</p>
                      )}
                      <p className="mt-2 text-sm text-apple-gray-500">
                        You will receive an M-Pesa prompt on this number to complete payment
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Review Order */}
              {currentStep === 4 && (
                <div>
                  <h2 className="text-2xl font-bold text-apple-gray-900 dark:text-white mb-6">
                    Review Your Order
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Order Items */}
                    <div>
                      <h3 className="font-semibold text-apple-gray-900 dark:text-white mb-3">Order Items</h3>
                      <div className="space-y-3">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex items-center justify-between py-2 border-b border-apple-gray-200 dark:border-apple-gray-700">
                            <div className="flex items-center space-x-3">
                              <img src={item.image} alt={item.name} className="w-12 h-12 object-contain bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg" />
                              <div>
                                <div className="font-medium text-apple-gray-900 dark:text-white">{item.name}</div>
                                <div className="text-sm text-apple-gray-600">Qty: {item.quantity}</div>
                              </div>
                            </div>
                            <div className="font-medium text-apple-gray-900 dark:text-white">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Customer Details */}
                    <div>
                      <h3 className="font-semibold text-apple-gray-900 dark:text-white mb-3">Customer Details</h3>
                      <div className="text-sm text-apple-gray-600 dark:text-apple-gray-300 space-y-1">
                        <p>{formData.firstName} {formData.lastName}</p>
                        <p>{formData.email}</p>
                        <p>{formatPhoneNumber(formData.phone)}</p>
                      </div>
                    </div>

                    {/* Delivery Details */}
                    <div>
                      <h3 className="font-semibold text-apple-gray-900 dark:text-white mb-3">Delivery Details</h3>
                      <div className="text-sm text-apple-gray-600 dark:text-apple-gray-300 space-y-1">
                        <p>{selectedDelivery?.name} - {selectedDelivery?.description}</p>
                        <p>{formData.address}</p>
                        <p>{formData.city}, {formData.county}</p>
                        {formData.deliveryInstructions && (
                          <p>Instructions: {formData.deliveryInstructions}</p>
                        )}
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <h3 className="font-semibold text-apple-gray-900 dark:text-white mb-3">Payment Method</h3>
                      <div className="text-sm text-apple-gray-600 dark:text-apple-gray-300">
                        <p>M-Pesa: {formatPhoneNumber(formData.mpesaPhone)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={handlePrevStep}
                  disabled={currentStep === 1}
                  className="px-6 py-3 border border-apple-gray-300 dark:border-apple-gray-600 rounded-lg font-medium hover:bg-apple-gray-50 dark:hover:bg-apple-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                
                {currentStep < 4 ? (
                  <button
                    onClick={handleNextStep}
                    className="px-6 py-3 bg-platypus-green text-white rounded-lg font-medium hover:bg-platypus-green/90 transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="px-8 py-3 bg-platypus-green text-white rounded-lg font-medium hover:bg-platypus-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>Place Order</span>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-apple-gray-800 rounded-2xl p-6 border border-apple-gray-200 dark:border-apple-gray-700 sticky top-8">
            <h3 className="font-semibold text-apple-gray-900 dark:text-white mb-4">Order Summary</h3>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-apple-gray-600">Subtotal:</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-apple-gray-600">Delivery:</span>
                <span className="font-medium">
                  {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                </span>
              </div>
              <div className="border-t border-apple-gray-200 dark:border-apple-gray-700 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-apple-gray-900 dark:text-white">Total:</span>
                  <span className="text-xl font-bold text-platypus-green">{formatPrice(totalAmount)}</span>
                </div>
              </div>
            </div>

            <div className="bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg p-4 space-y-2">
              <div className="flex items-center space-x-2">
                <ShieldCheckIcon className="w-4 h-4 text-platypus-green" />
                <span className="text-sm">Secure M-Pesa payment</span>
              </div>
              <div className="flex items-center space-x-2">
                <TruckIcon className="w-4 h-4 text-platypus-green" />
                <span className="text-sm">Tracked delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Age Verification Modal */}
      <AnimatePresence>
        {ageVerificationStep && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-apple-gray-800 rounded-2xl p-8 max-w-md w-full"
            >
              <div className="text-center">
                <ExclamationTriangleIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-apple-gray-900 dark:text-white mb-4">
                  Age Verification Required
                </h3>
                <p className="text-apple-gray-600 dark:text-apple-gray-300 mb-6">
                  You must be 21 or older to purchase alcoholic beverages in Kenya. 
                  Valid ID will be required upon delivery.
                </p>
                <p className="text-apple-gray-600 dark:text-apple-gray-300 mb-8">
                  Are you 21 years of age or older?
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleAgeVerification(true)}
                    className="flex-1 bg-platypus-green text-white py-3 rounded-xl font-semibold hover:bg-platypus-green/90 transition-colors"
                  >
                    Yes, I'm 21+
                  </button>
                  <button
                    onClick={() => handleAgeVerification(false)}
                    className="flex-1 bg-apple-gray-200 dark:bg-apple-gray-600 py-3 rounded-xl font-semibold hover:bg-apple-gray-300 dark:hover:bg-apple-gray-500 transition-colors"
                  >
                    No
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Checkout
