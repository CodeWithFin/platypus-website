import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  HeartIcon, 
  ShareIcon, 
  StarIcon,
  ShoppingCartIcon,
  TruckIcon,
  ShieldCheckIcon,
  ClockIcon,
  PhoneIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { products } from '../data/products'
import { formatPrice } from '../utils/helpers'
import ProductCard from '../components/product/ProductCard'
import toast from 'react-hot-toast'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { user } = useAuth()
  
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const [showAgeVerification, setShowAgeVerification] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState([])

  useEffect(() => {
    // Simulate API call
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const foundProduct = products.find(p => p.id === parseInt(id))
        if (foundProduct) {
          setProduct({
            ...foundProduct,
            images: [
              foundProduct.image,
              // Add more mock images for gallery
              foundProduct.image.replace('.jpg', '-2.jpg'),
              foundProduct.image.replace('.jpg', '-3.jpg'),
              foundProduct.image.replace('.jpg', '-4.jpg'),
            ],
            reviews: generateMockReviews(),
            specifications: generateSpecifications(foundProduct)
          })
          
          // Find related products
          const related = products
            .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
            .slice(0, 4)
          setRelatedProducts(related)
        } else {
          navigate('/404')
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        toast.error('Failed to load product details')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id, navigate])

  const generateMockReviews = () => [
    {
      id: 1,
      name: 'James Kamau',
      rating: 5,
      date: '2024-01-15',
      comment: 'Excellent quality whisky! Smooth finish and great value for money. Delivery was quick too.',
      verified: true
    },
    {
      id: 2,
      name: 'Sarah Wanjiku',
      rating: 4,
      date: '2024-01-10',
      comment: 'Good product, arrived well packaged. The taste is exactly as described.',
      verified: true
    },
    {
      id: 3,
      name: 'David Ochieng',
      rating: 5,
      date: '2024-01-05',
      comment: 'Premium quality spirits at competitive prices. Platypus Liquor never disappoints!',
      verified: true
    }
  ]

  const generateSpecifications = (product) => ({
    'Alcohol Content': `${product.alcoholContent}%`,
    'Volume': '750ml',
    'Origin': product.brand.includes('Johnnie') ? 'Scotland' : 
              product.brand.includes('Hennessy') ? 'France' :
              product.brand.includes('Grey Goose') ? 'France' : 'Kenya',
    'Brand': product.brand,
    'Category': product.category,
    'Serving Temperature': product.category === 'wine' ? '16-18°C' : 'Room Temperature'
  })

  const handleAddToCart = () => {
    if (product.alcoholContent > 0 && !user?.ageVerified) {
      setShowAgeVerification(true)
      return
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity
    })
    
    toast.success(`${product.name} added to cart!`, {
      icon: '🛒',
    })
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', {
      icon: isWishlisted ? '💔' : '❤️',
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this ${product.category} at Platypus Liquor Store`,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Product link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-platypus-green border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Product Not Found</h2>
          <p className="text-apple-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-platypus-green text-white px-6 py-2 rounded-full hover:bg-platypus-green/90 transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'reviews', label: `Reviews (${product.reviews?.length || 0})` },
    { id: 'delivery', label: 'Delivery Info' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 max-w-7xl"
    >
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-apple-gray-600 mb-8">
        <button onClick={() => navigate('/')} className="hover:text-platypus-green">Home</button>
        <span>/</span>
        <button onClick={() => navigate('/products')} className="hover:text-platypus-green">Products</button>
        <span>/</span>
        <button onClick={() => navigate(`/products/${product.category}`)} className="hover:text-platypus-green capitalize">
          {product.category}
        </button>
        <span>/</span>
        <span className="text-apple-gray-900 dark:text-apple-gray-100">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Images */}
        <div className="space-y-4">
          <motion.div
            className="aspect-square bg-apple-gray-50 dark:bg-apple-gray-800 rounded-2xl overflow-hidden relative"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.src = product.image // Fallback to main image
              }}
            />
            
            {/* Image Navigation */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImage(selectedImage === 0 ? product.images.length - 1 : selectedImage - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transition-all"
                >
                  <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setSelectedImage(selectedImage === product.images.length - 1 ? 0 : selectedImage + 1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transition-all"
                >
                  <ChevronRightIcon className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Sale Badge */}
            {product.originalPrice && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </div>
            )}
          </motion.div>

          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index
                      ? 'border-platypus-green'
                      : 'border-apple-gray-200 dark:border-apple-gray-700 hover:border-apple-gray-300 dark:hover:border-apple-gray-600'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-contain bg-apple-gray-50 dark:bg-apple-gray-800"
                    onError={(e) => {
                      e.target.src = product.image
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-apple-gray-900 dark:text-white mb-2">
              {product.name}
            </h1>
            <p className="text-lg text-apple-gray-600 dark:text-apple-gray-300">
              {product.brand}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                i < Math.floor(product.rating) ? (
                  <StarSolidIcon key={i} className="w-5 h-5 text-yellow-400" />
                ) : (
                  <StarIcon key={i} className="w-5 h-5 text-apple-gray-300" />
                )
              ))}
            </div>
            <span className="text-sm text-apple-gray-600">
              {product.rating} ({product.reviews?.length || 0} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-3">
            <span className="text-3xl font-bold text-platypus-green">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xl text-apple-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border border-apple-gray-300 dark:border-apple-gray-600 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-700 transition-colors"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-2 border-x border-apple-gray-300 dark:border-apple-gray-600 min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-700 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 bg-platypus-green hover:bg-platypus-green/90 disabled:bg-apple-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center space-x-2 transition-colors"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                <span>Add to Cart</span>
              </motion.button>

              <button
                onClick={handleWishlist}
                className="p-4 border border-apple-gray-300 dark:border-apple-gray-600 hover:border-platypus-green hover:bg-platypus-green/5 rounded-xl transition-colors"
              >
                {isWishlisted ? (
                  <HeartSolidIcon className="w-6 h-6 text-red-500" />
                ) : (
                  <HeartIcon className="w-6 h-6" />
                )}
              </button>

              <button
                onClick={handleShare}
                className="p-4 border border-apple-gray-300 dark:border-apple-gray-600 hover:border-platypus-green hover:bg-platypus-green/5 rounded-xl transition-colors"
              >
                <ShareIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="bg-apple-gray-50 dark:bg-apple-gray-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center space-x-3">
              <TruckIcon className="w-5 h-5 text-platypus-green" />
              <span className="text-sm">Free delivery within Nairobi for orders over KES 3,000</span>
            </div>
            <div className="flex items-center space-x-3">
              <ShieldCheckIcon className="w-5 h-5 text-platypus-green" />
              <span className="text-sm">100% authentic products guaranteed</span>
            </div>
            <div className="flex items-center space-x-3">
              <ClockIcon className="w-5 h-5 text-platypus-green" />
              <span className="text-sm">Same-day delivery available</span>
            </div>
            <div className="flex items-center space-x-3">
              <PhoneIcon className="w-5 h-5 text-platypus-green" />
              <span className="text-sm">24/7 customer support: +254 700 123 456</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="border-t border-apple-gray-200 dark:border-apple-gray-700 pt-8">
        <div className="flex space-x-8 border-b border-apple-gray-200 dark:border-apple-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-1 font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-platypus-green border-b-2 border-platypus-green'
                  : 'text-apple-gray-600 hover:text-apple-gray-900 dark:hover:text-apple-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'description' && (
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-lg text-apple-gray-700 dark:text-apple-gray-300 leading-relaxed">
                    {product.description || `Experience the premium quality of ${product.name}, a carefully selected ${product.category} from ${product.brand}. This exceptional spirit offers a perfect balance of flavor and character, making it an ideal choice for both connoisseurs and casual enthusiasts.`}
                  </p>
                  <h3 className="text-xl font-semibold mt-6 mb-3">Tasting Notes</h3>
                  <ul className="space-y-2">
                    <li><strong>Appearance:</strong> Rich amber color with golden highlights</li>
                    <li><strong>Nose:</strong> Complex aromas with hints of vanilla, oak, and subtle spices</li>
                    <li><strong>Palate:</strong> Smooth and well-balanced with notes of caramel and fruit</li>
                    <li><strong>Finish:</strong> Long and satisfying with a warm, lingering aftertaste</li>
                  </ul>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-apple-gray-200 dark:border-apple-gray-700">
                      <span className="font-medium text-apple-gray-900 dark:text-apple-gray-100">{key}:</span>
                      <span className="text-apple-gray-600 dark:text-apple-gray-400">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {product.reviews?.map((review) => (
                    <div key={review.id} className="border border-apple-gray-200 dark:border-apple-gray-700 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-apple-gray-900 dark:text-apple-gray-100">
                            {review.name}
                            {review.verified && (
                              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                Verified Purchase
                              </span>
                            )}
                          </h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                i < review.rating ? (
                                  <StarSolidIcon key={i} className="w-4 h-4 text-yellow-400" />
                                ) : (
                                  <StarIcon key={i} className="w-4 h-4 text-apple-gray-300" />
                                )
                              ))}
                            </div>
                            <span className="text-sm text-apple-gray-500">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-apple-gray-700 dark:text-apple-gray-300">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'delivery' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Delivery Options</h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <TruckIcon className="w-5 h-5 text-platypus-green mt-1" />
                        <div>
                          <h4 className="font-medium">Standard Delivery</h4>
                          <p className="text-sm text-apple-gray-600">2-3 business days • KES 200</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <ClockIcon className="w-5 h-5 text-platypus-green mt-1" />
                        <div>
                          <h4 className="font-medium">Same-Day Delivery</h4>
                          <p className="text-sm text-apple-gray-600">Within Nairobi • KES 500</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <ShieldCheckIcon className="w-5 h-5 text-platypus-green mt-1" />
                        <div>
                          <h4 className="font-medium">Free Delivery</h4>
                          <p className="text-sm text-apple-gray-600">Orders over KES 3,000 within Nairobi</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Important Information</h3>
                    <div className="space-y-3 text-sm text-apple-gray-600">
                      <p>• Age verification required for all alcohol purchases (21+)</p>
                      <p>• Valid ID must be presented upon delivery</p>
                      <p>• Alcohol cannot be delivered to certain restricted areas</p>
                      <p>• Returns not accepted for opened alcohol products</p>
                      <p>• All products are 100% authentic and properly stored</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-apple-gray-900 dark:text-white mb-8">
            You might also like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}

      {/* Age Verification Modal */}
      <AnimatePresence>
        {showAgeVerification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAgeVerification(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-apple-gray-800 rounded-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-center mb-4">Age Verification Required</h3>
              <p className="text-center text-apple-gray-600 dark:text-apple-gray-300 mb-6">
                You must be 21 or older to purchase alcoholic beverages in Kenya.
              </p>
              <p className="text-center text-apple-gray-600 dark:text-apple-gray-300 mb-8">
                Are you 21 years of age or older?
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowAgeVerification(false)
                    handleAddToCart()
                  }}
                  className="flex-1 bg-platypus-green text-white py-3 rounded-xl font-semibold hover:bg-platypus-green/90 transition-colors"
                >
                  Yes, I'm 21+
                </button>
                <button
                  onClick={() => setShowAgeVerification(false)}
                  className="flex-1 bg-apple-gray-200 dark:bg-apple-gray-600 py-3 rounded-xl font-semibold hover:bg-apple-gray-300 dark:hover:bg-apple-gray-500 transition-colors"
                >
                  No
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default ProductDetail
