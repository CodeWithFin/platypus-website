import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { 
  TrashIcon, 
  PlusIcon, 
  MinusIcon,
  ShoppingBagIcon,
  TruckIcon,
  ShieldCheckIcon,
  ClockIcon,
  TagIcon
} from '@heroicons/react/24/outline'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/helpers'
import toast from 'react-hot-toast'

const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    getTotalPrice, 
    getTotalItems,
    clearCart 
  } = useCart()
  const navigate = useNavigate()
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState(null)
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)

  const deliveryThreshold = 3000
  const deliveryFee = 200
  const subtotal = getTotalPrice()
  const isEligibleForFreeDelivery = subtotal >= deliveryThreshold
  const finalDeliveryFee = isEligibleForFreeDelivery ? 0 : deliveryFee
  const promoDiscount = appliedPromo ? subtotal * (appliedPromo.discount / 100) : 0
  const totalPrice = subtotal - promoDiscount + finalDeliveryFee

  const promoCodes = {
    'WELCOME10': { discount: 10, description: '10% off your first order' },
    'PLATYPUS15': { discount: 15, description: '15% off for loyal customers' },
    'WEEKEND20': { discount: 20, description: '20% off weekend special' }
  }

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(id)
      return
    }
    updateQuantity(id, newQuantity)
  }

  const handleRemoveItem = (id) => {
    removeFromCart(id)
    toast.success('Item removed from cart')
  }

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      toast.error('Please enter a promo code')
      return
    }

    setIsApplyingPromo(true)
    
    // Simulate API call
    setTimeout(() => {
      const promo = promoCodes[promoCode.toUpperCase()]
      if (promo) {
        setAppliedPromo({ ...promo, code: promoCode.toUpperCase() })
        toast.success(`Promo code applied! ${promo.description}`, {
          icon: '🎉',
        })
      } else {
        toast.error('Invalid promo code')
      }
      setIsApplyingPromo(false)
    }, 1000)
  }

  const handleRemovePromo = () => {
    setAppliedPromo(null)
    setPromoCode('')
    toast.success('Promo code removed')
  }

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty')
      return
    }
    navigate('/checkout')
  }

  if (cartItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-16 text-center"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-md mx-auto"
        >
          <ShoppingBagIcon className="w-24 h-24 text-apple-gray-300 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-apple-gray-900 dark:text-white mb-4">
            Your cart is empty
          </h1>
          <p className="text-apple-gray-600 dark:text-apple-gray-300 mb-8">
            Discover our premium selection of spirits, wines, and beverages.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 bg-platypus-green text-white px-8 py-4 rounded-xl font-semibold hover:bg-platypus-green/90 transition-colors"
          >
            <ShoppingBagIcon className="w-5 h-5" />
            <span>Start Shopping</span>
          </Link>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8 max-w-7xl"
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-apple-gray-900 dark:text-white">
          Shopping Cart
        </h1>
        <div className="text-sm text-apple-gray-600">
          {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white dark:bg-apple-gray-800 rounded-2xl p-6 shadow-sm border border-apple-gray-200 dark:border-apple-gray-700"
              >
                <div className="flex items-center space-x-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-contain bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-apple-gray-900 dark:text-white mb-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-apple-gray-600 dark:text-apple-gray-300 mb-2">
                      {item.brand}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-platypus-green">
                        {formatPrice(item.price)}
                      </span>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center border border-apple-gray-300 dark:border-apple-gray-600 rounded-lg">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-700 transition-colors rounded-l-lg"
                          >
                            <MinusIcon className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 border-x border-apple-gray-300 dark:border-apple-gray-600 min-w-[60px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-700 transition-colors rounded-r-lg"
                          >
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Item Total */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-apple-gray-200 dark:border-apple-gray-700">
                  <span className="text-sm text-apple-gray-600">Item Total:</span>
                  <span className="font-semibold text-apple-gray-900 dark:text-white">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Clear Cart Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              clearCart()
              toast.success('Cart cleared')
            }}
            className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 py-3 rounded-xl font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            Clear Cart
          </motion.button>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          {/* Promo Code */}
          <div className="bg-white dark:bg-apple-gray-800 rounded-2xl p-6 shadow-sm border border-apple-gray-200 dark:border-apple-gray-700">
            <h3 className="font-semibold text-apple-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <TagIcon className="w-5 h-5" />
              <span>Promo Code</span>
            </h3>
            
            {appliedPromo ? (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-green-800 dark:text-green-400">
                    {appliedPromo.code}
                  </span>
                  <button
                    onClick={handleRemovePromo}
                    className="text-green-600 hover:text-green-700 text-sm underline"
                  >
                    Remove
                  </button>
                </div>
                <p className="text-sm text-green-600 dark:text-green-300">
                  {appliedPromo.description}
                </p>
              </div>
            ) : (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter promo code"
                  className="flex-1 px-4 py-3 border border-apple-gray-300 dark:border-apple-gray-600 rounded-lg bg-white dark:bg-apple-gray-700 focus:ring-2 focus:ring-platypus-green focus:border-transparent"
                />
                <button
                  onClick={handleApplyPromo}
                  disabled={isApplyingPromo}
                  className="px-4 py-3 bg-platypus-green text-white rounded-lg hover:bg-platypus-green/90 disabled:opacity-50 transition-colors"
                >
                  {isApplyingPromo ? 'Applying...' : 'Apply'}
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-apple-gray-800 rounded-2xl p-6 shadow-sm border border-apple-gray-200 dark:border-apple-gray-700">
            <h3 className="font-semibold text-apple-gray-900 dark:text-white mb-4">
              Order Summary
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-apple-gray-600">Subtotal:</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              
              {appliedPromo && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({appliedPromo.discount}%):</span>
                  <span>-{formatPrice(promoDiscount)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-apple-gray-600">Delivery:</span>
                <span className={`font-medium ${isEligibleForFreeDelivery ? 'text-green-600' : ''}`}>
                  {isEligibleForFreeDelivery ? 'FREE' : formatPrice(deliveryFee)}
                </span>
              </div>
              
              {!isEligibleForFreeDelivery && (
                <div className="text-sm text-apple-gray-500 bg-apple-gray-50 dark:bg-apple-gray-700 p-3 rounded-lg">
                  Add {formatPrice(deliveryThreshold - subtotal)} more for free delivery
                </div>
              )}
              
              <div className="border-t border-apple-gray-200 dark:border-apple-gray-700 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-apple-gray-900 dark:text-white">
                    Total:
                  </span>
                  <span className="text-xl font-bold text-platypus-green">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="bg-apple-gray-50 dark:bg-apple-gray-800 rounded-2xl p-6 space-y-3">
            <div className="flex items-center space-x-3">
              <TruckIcon className="w-5 h-5 text-platypus-green" />
              <span className="text-sm">Free delivery on orders over KES 3,000</span>
            </div>
            <div className="flex items-center space-x-3">
              <ShieldCheckIcon className="w-5 h-5 text-platypus-green" />
              <span className="text-sm">Secure checkout with M-Pesa</span>
            </div>
            <div className="flex items-center space-x-3">
              <ClockIcon className="w-5 h-5 text-platypus-green" />
              <span className="text-sm">Same-day delivery available</span>
            </div>
          </div>

          {/* Checkout Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleProceedToCheckout}
            className="w-full bg-platypus-green text-white py-4 rounded-xl font-semibold text-lg hover:bg-platypus-green/90 transition-colors"
          >
            Proceed to Checkout
          </motion.button>

          {/* Continue Shopping */}
          <Link
            to="/products"
            className="block text-center text-platypus-green hover:text-platypus-green/80 font-medium transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default Cart
