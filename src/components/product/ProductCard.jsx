import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Eye,
  Percent,
  Package
} from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useWishlist } from '../../context/WishlistContext'
import { formatPrice, calculateDiscount } from '../../utils/helpers'
import toast from 'react-hot-toast'

const ProductCard = ({ product, className = '' }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const { addItem } = useCart()
  const { isAuthenticated } = useAuth()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  const discount = calculateDiscount(product.originalPrice, product.price)
  const hasDiscount = discount > 0
  const isWishlisted = isInWishlist(product.id)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
  }

  const handleWishlist = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isWishlisted) {
      await removeFromWishlist(product.id)
    } else {
      await addToWishlist(product)
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={`${
          i < Math.floor(rating)
            ? 'text-platypus-gold-400 fill-current'
            : 'text-apple-gray-300 dark:text-apple-gray-600'
        }`}
      />
    ))
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`card card-hover group relative ${className}`}
    >
      <Link to={`/product/${product.id}`} className="block">
        {/* Product image */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-t-2xl bg-apple-gray-100 dark:bg-apple-gray-800">
          {/* Discount badge */}
          {hasDiscount && (
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center space-x-1"
            >
              <Percent size={12} />
              <span>-{discount}%</span>
            </motion.div>
          )}

          {/* Stock indicator */}
          {!product.inStock && (
            <div className="absolute top-3 right-3 z-10 bg-apple-gray-900 text-white text-xs font-medium px-2 py-1 rounded-lg">
              Out of Stock
            </div>
          )}

          {/* Low stock warning */}
          {product.inStock && product.stockCount <= 5 && (
            <div className="absolute top-3 right-3 z-10 bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded-lg flex items-center space-x-1">
              <Package size={12} />
              <span>Only {product.stockCount} left</span>
            </div>
          )}

          {/* Product image */}
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover product-image transition-opacity duration-300 ${
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIsImageLoaded(true)}
            loading="lazy"
          />
          
          {/* Loading placeholder */}
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-apple-gray-200 dark:bg-apple-gray-700 animate-pulse" />
          )}

          {/* Overlay with quick actions */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between">
                {/* Quick view */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    // Quick view modal would open here
                  }}
                  aria-label="Quick view"
                >
                  <Eye size={16} />
                </motion.button>

                {/* Wishlist */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleWishlist}
                  className={`p-2 backdrop-blur-sm rounded-full transition-colors ${
                    isWishlisted
                      ? 'bg-red-500 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                  aria-label="Add to wishlist"
                >
                  <Heart size={16} className={isWishlisted ? 'fill-current' : ''} />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Product info */}
        <div className="p-4">
          {/* Brand and category */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-platypus-green-600 dark:text-platypus-gold-400 uppercase tracking-wide">
              {product.brand}
            </span>
            <span className="text-xs text-apple-gray-500 dark:text-apple-gray-400 capitalize">
              {product.category}
            </span>
          </div>

          {/* Product name */}
          <h3 className="font-semibold text-apple-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-platypus-green-600 dark:group-hover:text-platypus-gold-400 transition-colors">
            {product.name}
          </h3>

          {/* Size and alcohol content */}
          <div className="flex items-center space-x-3 mb-3 text-xs text-apple-gray-600 dark:text-apple-gray-400">
            <span>{product.size}</span>
            <span>•</span>
            <span>{product.alcoholContent} ABV</span>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex items-center space-x-1">
              {renderStars(product.rating)}
            </div>
            <span className="text-sm text-apple-gray-600 dark:text-apple-gray-400">
              ({product.reviews})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-apple-gray-900 dark:text-white">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-apple-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Add to cart button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
              product.inStock
                ? 'bg-platypus-green-500 hover:bg-platypus-green-600 text-white'
                : 'bg-apple-gray-200 dark:bg-apple-gray-700 text-apple-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart size={16} />
            <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
          </motion.button>
        </div>
      </Link>
    </motion.div>
  )
}

export default ProductCard
