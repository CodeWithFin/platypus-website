import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { 
  ArrowRight, 
  Star, 
  Truck, 
  Shield, 
  Award,
  Zap,
  Gift,
  Phone
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { products, categories, promotions } from '@/data/products'
import { formatPrice, getGreeting } from '@/utils/helpers'
import ProductCard from '@/components/product/ProductCard'
import CategoryCard from '@/components/product/CategoryCard'

const Home = () => {
  const { user, isAuthenticated } = useAuth()
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 300], [0, -50])
  const y2 = useTransform(scrollY, [0, 300], [0, -100])
  
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0)
  const featuredProducts = products.filter(product => product.featured)

  // Auto-rotate promotions
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPromoIndex((prev) => (prev + 1) % promotions.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-platypus-green-50 via-white to-platypus-gold-50 dark:from-apple-gray-950 dark:via-black dark:to-apple-gray-900">
        {/* Background elements */}
        <motion.div
          style={{ y: y1 }}
          className="absolute inset-0 opacity-5"
        >
          <div className="absolute top-20 left-10 w-64 h-64 bg-platypus-green-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-platypus-gold-400 rounded-full blur-3xl" />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Greeting */}
            {isAuthenticated && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-lg text-platypus-green-600 dark:text-platypus-gold-400 font-medium mb-4"
              >
                {getGreeting(user?.name)}
              </motion.p>
            )}

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-bold text-apple-gray-900 dark:text-white mb-6 leading-tight"
            >
              Premium{' '}
              <span className="text-gradient">Spirits</span>
              <br />
              Delivered to Your{' '}
              <span className="text-gradient">Doorstep</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg sm:text-xl text-apple-gray-600 dark:text-apple-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed text-balance"
            >
              Discover Kenya's finest collection of gin, whisky, wine, and premium spirits. 
              Quality guaranteed, delivered fast across the country.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Link
                to="/products"
                className="btn-primary group flex items-center space-x-2 text-lg px-8 py-4"
              >
                <span>Shop Now</span>
                <ArrowRight 
                  size={20} 
                  className="group-hover:translate-x-1 transition-transform duration-300" 
                />
              </Link>
              
              <Link
                to="/about"
                className="btn-outline text-lg px-8 py-4"
              >
                Learn More
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="flex flex-wrap justify-center items-center gap-8 text-sm text-apple-gray-600 dark:text-apple-gray-400"
            >
              <div className="flex items-center space-x-2">
                <Truck size={16} className="text-platypus-green-500" />
                <span>Free delivery above KES 2,500</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield size={16} className="text-platypus-green-500" />
                <span>100% Authentic products</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap size={16} className="text-platypus-green-500" />
                <span>Same-day delivery in Nakuru</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-apple-gray-400 dark:border-apple-gray-600 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-apple-gray-400 dark:bg-apple-gray-600 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* Promotions Banner */}
      <section className="py-4 bg-platypus-gold-400 text-white overflow-hidden">
        <div className="relative">
          <motion.div
            key={currentPromoIndex}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="flex items-center justify-center space-x-2">
              <Gift size={20} />
              <span className="font-semibold">
                {promotions[currentPromoIndex]?.title}:
              </span>
              <span>{promotions[currentPromoIndex]?.description}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 lg:py-24 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-apple-gray-900 dark:text-white mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-apple-gray-600 dark:text-apple-gray-300 max-w-2xl mx-auto">
              Explore our carefully curated collection of premium spirits
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <CategoryCard category={category} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-24 bg-apple-gray-50 dark:bg-apple-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-apple-gray-900 dark:text-white mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-apple-gray-600 dark:text-apple-gray-300 max-w-2xl mx-auto">
              Discover our most popular and recommended spirits
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/products"
              className="btn-outline text-lg px-8 py-4 inline-flex items-center space-x-2"
            >
              <span>View All Products</span>
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-apple-gray-900 dark:text-white mb-4">
              Why Choose Platypus?
            </h2>
            <p className="text-lg text-apple-gray-600 dark:text-apple-gray-300 max-w-2xl mx-auto">
              We're committed to providing the best liquor shopping experience in Kenya
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: Shield, 
                title: 'Authentic Products', 
                description: '100% genuine spirits from authorized distributors' 
              },
              { 
                icon: Truck, 
                title: 'Fast Delivery', 
                description: 'Same-day delivery in Nakuru, nationwide shipping available' 
              },
              { 
                icon: Award, 
                title: 'Premium Quality', 
                description: 'Carefully curated selection of the finest spirits' 
              },
              { 
                icon: Phone, 
                title: '24/7 Support', 
                description: 'Dedicated customer service team ready to help' 
              }
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-platypus-green-500 to-platypus-gold-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-apple-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-apple-gray-600 dark:text-apple-gray-300">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-platypus-green-500 to-platypus-gold-400 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Discover Premium Spirits?
            </h2>
            <p className="text-lg sm:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust Platypus for their premium liquor needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-white text-platypus-green-600 hover:bg-apple-gray-100 font-semibold py-4 px-8 rounded-xl transition-colors duration-300 inline-flex items-center justify-center space-x-2"
              >
                <span>Start Shopping</span>
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white hover:bg-white hover:text-platypus-green-600 font-semibold py-4 px-8 rounded-xl transition-colors duration-300"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
