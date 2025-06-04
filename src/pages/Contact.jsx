import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send,
  MessageSquare,
  User,
  CheckCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      toast.success('Message sent successfully! We\'ll get back to you soon.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
      setIsSubmitting(false)
    }, 1500)
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Our Store',
      details: [
        'Kenyatta Avenue, Nakuru',
        'Next to Nakuru Law Courts',
        'Nakuru, Kenya'
      ]
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: [
        '+254 712 345 678',
        '+254 732 123 456',
        'WhatsApp Available'
      ]
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: [
        'info@platypusliquor.co.ke',
        'support@platypusliquor.co.ke',
        'orders@platypusliquor.co.ke'
      ]
    },
    {
      icon: Clock,
      title: 'Store Hours',
      details: [
        'Mon-Sat: 9:00 AM - 8:00 PM',
        'Sunday: 11:00 AM - 6:00 PM',
        'Public Holidays: Closed'
      ]
    }
  ]

  const faqs = [
    {
      question: 'What is the minimum order value for delivery?',
      answer: 'There is no minimum order value. However, orders above KES 2,500 qualify for free delivery within Nakuru.'
    },
    {
      question: 'Do you deliver outside Nakuru?',
      answer: 'Yes, we deliver to major cities across Kenya including Nairobi, Mombasa, Kisumu, and Eldoret. Delivery times vary by location.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept M-Pesa, Airtel Money, Visa/Mastercard, and cash on delivery for select areas.'
    },
    {
      question: 'How do you verify age for alcohol purchases?',
      answer: 'All customers must provide valid ID showing they are 18+ years old. We verify age at both order placement and delivery.'
    },
    {
      question: 'Can I return or exchange products?',
      answer: 'Due to the nature of alcoholic beverages, we only accept returns for damaged or defective products within 24 hours of delivery.'
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-platypus-green-50 via-white to-platypus-gold-50 dark:from-apple-gray-950 dark:via-black dark:to-apple-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-apple-gray-900 dark:text-apple-gray-100 mb-6">
              Get in{' '}
              <span className="text-gradient">
                Touch
              </span>
            </h1>
            <p className="text-xl text-apple-gray-600 dark:text-apple-gray-400 max-w-3xl mx-auto leading-relaxed">
              Have questions about our products or services? We're here to help! 
              Reach out to us through any of the channels below.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 bg-white dark:bg-apple-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => {
              const Icon = info.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card p-6 text-center card-hover"
                >
                  <div className="w-16 h-16 bg-platypus-green-100 dark:bg-platypus-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-platypus-green-600 dark:text-platypus-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-3">
                    {info.title}
                  </h3>
                  <div className="space-y-1">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-apple-gray-600 dark:text-apple-gray-400 text-sm">
                        {detail}
                      </p>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-apple-gray-50 dark:bg-apple-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="card p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <MessageSquare className="w-6 h-6 text-platypus-green-600 dark:text-platypus-green-400" />
                  <h2 className="text-2xl font-bold text-apple-gray-900 dark:text-apple-gray-100">
                    Send us a Message
                  </h2>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-apple-gray-700 dark:text-apple-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-apple-gray-300 dark:border-apple-gray-600 rounded-lg focus:ring-2 focus:ring-platypus-green-500 focus:border-transparent bg-white dark:bg-apple-gray-800 text-apple-gray-900 dark:text-apple-gray-100"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-apple-gray-700 dark:text-apple-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-apple-gray-300 dark:border-apple-gray-600 rounded-lg focus:ring-2 focus:ring-platypus-green-500 focus:border-transparent bg-white dark:bg-apple-gray-800 text-apple-gray-900 dark:text-apple-gray-100"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-apple-gray-700 dark:text-apple-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-apple-gray-300 dark:border-apple-gray-600 rounded-lg focus:ring-2 focus:ring-platypus-green-500 focus:border-transparent bg-white dark:bg-apple-gray-800 text-apple-gray-900 dark:text-apple-gray-100"
                        placeholder="+254 712 345 678"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-apple-gray-700 dark:text-apple-gray-300 mb-2">
                        Subject *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-apple-gray-300 dark:border-apple-gray-600 rounded-lg focus:ring-2 focus:ring-platypus-green-500 focus:border-transparent bg-white dark:bg-apple-gray-800 text-apple-gray-900 dark:text-apple-gray-100"
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="order">Order Support</option>
                        <option value="delivery">Delivery Issues</option>
                        <option value="products">Product Information</option>
                        <option value="wholesale">Wholesale Inquiry</option>
                        <option value="feedback">Feedback</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-apple-gray-700 dark:text-apple-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-apple-gray-300 dark:border-apple-gray-600 rounded-lg focus:ring-2 focus:ring-platypus-green-500 focus:border-transparent bg-white dark:bg-apple-gray-800 text-apple-gray-900 dark:text-apple-gray-100 resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Map and Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Map Placeholder */}
              <div className="card p-6">
                <h3 className="text-xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-4">
                  Find Us Here
                </h3>
                <div className="aspect-w-16 aspect-h-9 bg-apple-gray-200 dark:bg-apple-gray-700 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-platypus-green-600 dark:text-platypus-green-400 mx-auto mb-2" />
                    <p className="text-apple-gray-600 dark:text-apple-gray-400">
                      Interactive Map Coming Soon
                    </p>
                    <p className="text-sm text-apple-gray-500 dark:text-apple-gray-500 mt-1">
                      Kenyatta Avenue, Nakuru
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Contact */}
              <div className="card p-6">
                <h3 className="text-xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-4">
                  Need Immediate Help?
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-apple-gray-900 dark:text-apple-gray-100">
                        WhatsApp
                      </p>
                      <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400">
                        +254 712 345 678
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-apple-gray-900 dark:text-apple-gray-100">
                        Call Us
                      </p>
                      <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400">
                        Available Mon-Sat, 9 AM - 8 PM
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium text-apple-gray-900 dark:text-apple-gray-100">
                        Email Support
                      </p>
                      <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400">
                        Response within 24 hours
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-apple-gray-900 dark:text-apple-gray-100 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-apple-gray-600 dark:text-apple-gray-400 max-w-3xl mx-auto">
              Quick answers to common questions about our products and services.
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card p-6"
              >
                <h3 className="text-lg font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-3 flex items-start">
                  <CheckCircle className="w-5 h-5 text-platypus-green-600 dark:text-platypus-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  {faq.question}
                </h3>
                <p className="text-apple-gray-600 dark:text-apple-gray-400 leading-relaxed ml-7">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
