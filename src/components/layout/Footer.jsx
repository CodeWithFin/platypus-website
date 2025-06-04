import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Facebook, 
  Twitter, 
  Instagram,
  Youtube,
  ArrowUp
} from 'lucide-react'
import { scrollToTop } from '@/utils/helpers'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    'Quick Links': [
      { name: 'About Us', path: '/about' },
      { name: 'Contact', path: '/contact' },
      { name: 'Delivery Info', path: '/delivery' },
      { name: 'Returns', path: '/returns' },
      { name: 'FAQ', path: '/faq' },
    ],
    'Categories': [
      { name: 'Premium Gin', path: '/products/gin' },
      { name: 'Fine Whisky', path: '/products/whisky' },
      { name: 'Quality Wines', path: '/products/wine' },
      { name: 'Premium Spirits', path: '/products/spirits' },
      { name: 'Special Offers', path: '/offers' },
    ],
    'Legal': [
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Age Verification', path: '/age-verification' },
      { name: 'Responsible Drinking', path: '/responsible-drinking' },
      { name: 'Sitemap', path: '/sitemap' },
    ]
  }

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, url: 'https://facebook.com/platypusliquor' },
    { name: 'Twitter', icon: Twitter, url: 'https://twitter.com/platypusliquor' },
    { name: 'Instagram', icon: Instagram, url: 'https://instagram.com/platypusliquor' },
    { name: 'YouTube', icon: Youtube, url: 'https://youtube.com/platypusliquor' },
  ]

  return (
    <footer className="bg-apple-gray-950 text-apple-gray-100 relative">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company info */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-platypus-green-500 to-platypus-gold-400 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <div>
                <span className="text-xl font-bold text-white">Platypus</span>
                <span className="block text-sm text-apple-gray-400 -mt-1">
                  Liquor Store
                </span>
              </div>
            </Link>
            
            <p className="text-apple-gray-300 mb-6 text-sm leading-relaxed">
              Kenya's premier destination for premium spirits, wines, and liquors. 
              We deliver quality and authenticity to your doorstep across the country.
            </p>

            {/* Contact info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-platypus-gold-400 flex-shrink-0" />
                <span className="text-apple-gray-300">
                  Kenyatta Avenue, Nakuru, Kenya
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-platypus-gold-400 flex-shrink-0" />
                <span className="text-apple-gray-300">+254 712 345 678</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-platypus-gold-400 flex-shrink-0" />
                <span className="text-apple-gray-300">info@platypusliquor.co.ke</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock size={16} className="text-platypus-gold-400 flex-shrink-0" />
                <span className="text-apple-gray-300">Mon-Sat: 9AM-10PM</span>
              </div>
            </div>
          </div>

          {/* Footer links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-white mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-apple-gray-300 hover:text-platypus-gold-400 transition-colors duration-300 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter signup */}
        <div className="mt-12 pt-8 border-t border-apple-gray-800">
          <div className="max-w-md">
            <h3 className="font-semibold text-white mb-2">Stay Updated</h3>
            <p className="text-apple-gray-300 text-sm mb-4">
              Get exclusive offers and new product notifications.
            </p>
            <form className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-apple-gray-800 border border-apple-gray-700 rounded-lg text-white placeholder-apple-gray-400 focus:ring-2 focus:ring-platypus-gold-400 focus:border-transparent transition-colors text-sm"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-platypus-gold-400 hover:bg-platypus-gold-500 text-white font-medium rounded-lg transition-colors text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="border-t border-apple-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-apple-gray-400 text-sm">
              <p>© {currentYear} Platypus Liquor Store. All rights reserved.</p>
              <p className="mt-1">
                <span className="text-red-500 font-medium">18+</span> Please drink responsibly. 
                Not for sale to persons under 18 years.
              </p>
            </div>

            {/* Social links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-apple-gray-400 hover:text-platypus-gold-400 transition-colors duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.name}
                  >
                    <Icon size={20} />
                  </motion.a>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      <motion.button
        onClick={() => scrollToTop()}
        className="absolute bottom-6 right-6 p-3 bg-platypus-green-500 hover:bg-platypus-green-600 text-white rounded-full shadow-lg transition-colors duration-300 focus-ring"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        aria-label="Back to top"
      >
        <ArrowUp size={20} />
      </motion.button>

      {/* Age verification notice */}
      <div className="bg-red-600 text-white text-center py-2 text-sm font-medium">
        <div className="max-w-7xl mx-auto px-4">
          🔞 This website contains information about alcoholic beverages. 
          You must be 18 years or older to access this site.
        </div>
      </div>
    </footer>
  )
}

export default Footer
