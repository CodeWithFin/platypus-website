import React from 'react'
import { motion } from 'framer-motion'
import { 
  Award, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Truck,
  Shield,
  Star,
  Heart,
  CheckCircle
} from 'lucide-react'

const About = () => {
  const stats = [
    { label: 'Years in Business', value: '8+', icon: Award },
    { label: 'Happy Customers', value: '5,000+', icon: Users },
    { label: 'Cities Served', value: '15+', icon: MapPin },
    { label: 'Products Available', value: '200+', icon: Star }
  ]

  const values = [
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'We source only authentic, premium spirits from verified suppliers and ensure proper storage conditions.'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Same-day delivery in Nakuru and express delivery to major cities across Kenya.'
    },
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Your satisfaction is our priority. We provide exceptional service and support at every step.'
    },
    {
      icon: CheckCircle,
      title: 'Responsible Service',
      description: 'We promote responsible drinking and strictly enforce age verification for all purchases.'
    }
  ]

  const team = [
    {
      name: 'James Kiprotich',
      role: 'Founder & CEO',
      description: 'With over 10 years in the liquor industry, James founded Platypus with a vision to bring premium spirits to every Kenyan home.',
      image: '/images/team/james.jpg'
    },
    {
      name: 'Sarah Wanjiku',
      role: 'Head of Operations',
      description: 'Sarah ensures smooth operations and maintains our high standards of customer service across all locations.',
      image: '/images/team/sarah.jpg'
    },
    {
      name: 'Peter Ochieng',
      role: 'Logistics Manager',
      description: 'Peter oversees our delivery network, ensuring your orders reach you safely and on time.',
      image: '/images/team/peter.jpg'
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
              About{' '}
              <span className="text-gradient">
                Platypus Liquor Store
              </span>
            </h1>
            <p className="text-xl text-apple-gray-600 dark:text-apple-gray-400 max-w-3xl mx-auto leading-relaxed">
              Kenya's premier online liquor retailer, bringing you the finest selection of 
              spirits, wines, and craft beverages with unmatched convenience and quality.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-apple-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-platypus-green-100 dark:bg-platypus-green-900 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-platypus-green-600 dark:text-platypus-green-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-apple-gray-900 dark:text-apple-gray-100 mb-2">
                    {stat.value}
                  </h3>
                  <p className="text-apple-gray-600 dark:text-apple-gray-400">
                    {stat.label}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-apple-gray-50 dark:bg-apple-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-apple-gray-900 dark:text-apple-gray-100 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-apple-gray-600 dark:text-apple-gray-400 leading-relaxed">
                <p>
                  Founded in 2016 in the heart of Nakuru, Platypus Liquor Store began as a small 
                  family business with a simple mission: to provide Kenyans with access to premium, 
                  authentic spirits and wines.
                </p>
                <p>
                  What started as a single store has grown into Kenya's leading online liquor 
                  retailer, serving customers across the country with an extensive catalog of 
                  over 200 products ranging from classic gins and whiskies to rare vintages 
                  and local craft spirits.
                </p>
                <p>
                  We're proud to be a Kenyan company that understands the local market while 
                  maintaining international standards of quality and service. Every bottle we 
                  sell is carefully selected and stored to ensure you receive only the best.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden">
                <img
                  src="/images/about/store-front.jpg"
                  alt="Platypus Liquor Store"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                  }}
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-platypus-green-500 text-white p-6 rounded-xl shadow-lg">
                <p className="text-2xl font-bold">8+</p>
                <p className="text-sm opacity-90">Years of Excellence</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-apple-gray-900 dark:text-apple-gray-100 mb-6">
              Our Values
            </h2>
            <p className="text-xl text-apple-gray-600 dark:text-apple-gray-400 max-w-3xl mx-auto">
              These core principles guide everything we do, from product selection to customer service.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card p-8 card-hover"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-platypus-green-100 dark:bg-platypus-green-900 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-platypus-green-600 dark:text-platypus-green-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-2">
                        {value.title}
                      </h3>
                      <p className="text-apple-gray-600 dark:text-apple-gray-400 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-apple-gray-50 dark:bg-apple-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-apple-gray-900 dark:text-apple-gray-100 mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-apple-gray-600 dark:text-apple-gray-400 max-w-3xl mx-auto">
              The passionate people behind Platypus Liquor Store, dedicated to bringing you the best service.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card p-6 text-center card-hover"
              >
                <div className="w-24 h-24 bg-platypus-green-100 dark:bg-platypus-green-900 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-12 h-12 text-platypus-green-600 dark:text-platypus-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-1">
                  {member.name}
                </h3>
                <p className="text-platypus-green-600 dark:text-platypus-green-400 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-apple-gray-600 dark:text-apple-gray-400 text-sm leading-relaxed">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-apple-gray-900 dark:text-apple-gray-100 mb-6">
              Visit Our Store
            </h2>
            <p className="text-xl text-apple-gray-600 dark:text-apple-gray-400 max-w-3xl mx-auto">
              Experience our collection in person at our flagship store in Nakuru.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="card p-6 text-center card-hover"
            >
              <MapPin className="w-12 h-12 text-platypus-green-600 dark:text-platypus-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-2">
                Location
              </h3>
              <p className="text-apple-gray-600 dark:text-apple-gray-400">
                Kenyatta Avenue, Nakuru<br />
                Next to Nakuru Law Courts<br />
                Nakuru, Kenya
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card p-6 text-center card-hover"
            >
              <Clock className="w-12 h-12 text-platypus-green-600 dark:text-platypus-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-2">
                Store Hours
              </h3>
              <p className="text-apple-gray-600 dark:text-apple-gray-400">
                Monday - Saturday: 9:00 AM - 8:00 PM<br />
                Sunday: 11:00 AM - 6:00 PM<br />
                Public Holidays: Closed
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card p-6 text-center card-hover"
            >
              <Phone className="w-12 h-12 text-platypus-green-600 dark:text-platypus-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-2">
                Contact Us
              </h3>
              <p className="text-apple-gray-600 dark:text-apple-gray-400">
                Phone: +254 712 345 678<br />
                WhatsApp: +254 712 345 678<br />
                Email: info@platypusliquor.co.ke
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
