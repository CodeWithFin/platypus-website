import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Package } from 'lucide-react'

const CategoryCard = ({ category }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="card card-hover group overflow-hidden"
    >
      <Link to={`/products/${category.id}`} className="block">
        {/* Category image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={category.image}
            alt={category.name}
            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 ${
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIsImageLoaded(true)}
            loading="lazy"
          />
          
          {/* Loading placeholder */}
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-apple-gray-200 dark:bg-apple-gray-700 animate-pulse" />
          )}
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-platypus-gold-400 transition-colors">
              {category.name}
            </h3>
            <p className="text-white/90 text-sm mb-3 line-clamp-2">
              {category.description}
            </p>
            
            {/* Product count and CTA */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-white/80 text-sm">
                <Package size={16} />
                <span>{category.productCount} products</span>
              </div>
              
              <motion.div
                className="flex items-center space-x-1 text-platypus-gold-400 group-hover:space-x-2 transition-all duration-300"
                whileHover={{ x: 4 }}
              >
                <span className="text-sm font-medium">Shop</span>
                <ArrowRight size={16} />
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default CategoryCard
