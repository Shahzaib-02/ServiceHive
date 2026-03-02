import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Home, Users, Star, TrendingUp, MapPin, Shield, Award,
  Clock, CheckCircle, ArrowRight, Brush, Zap, Globe,
  MessageCircle, DollarSign, Menu, X, ChevronDown, Car,
  Smartphone, Heart, Search
} from 'lucide-react'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'

const LandingPage = () => {
  const services = [
    { 
      image: 'https://picsum.photos/seed/homerepair/400/300.jpg', 
      name: 'Home Repair', 
      description: 'Professional repair services for your home' 
    },
    { 
      image: 'https://picsum.photos/seed/cleaning/400/300.jpg', 
      name: 'Cleaning', 
      description: 'Professional cleaning and maintenance services' 
    },
    { 
      image: 'https://picsum.photos/seed/homeservices/400/300.jpg', 
      name: 'Home Services', 
      description: 'Complete home solutions and renovations' 
    },
    { 
      image: 'https://picsum.photos/seed/automotive/400/300.jpg', 
      name: 'Automotive', 
      description: 'Car repair and maintenance services' 
    },
    { 
      image: 'https://picsum.photos/seed/techsupport/400/300.jpg', 
      name: 'Tech Support', 
      description: 'IT support and device repair services' 
    },
    { 
      image: 'https://picsum.photos/seed/healthbeauty/400/300.jpg', 
      name: 'Health & Beauty', 
      description: 'Personal care and wellness services' 
    },
  ]

  const features = [
    { 
      image: 'https://picsum.photos/seed/search/400/300.jpg',
      title: 'Smart Search', 
      description: 'Advanced search filters to find exactly what you need' 
    },
    { 
      image: 'https://picsum.photos/seed/verified/400/300.jpg',
      title: 'Verified Providers', 
      description: 'Background-checked professionals you can trust' 
    },
    { 
      image: 'https://picsum.photos/seed/reviews/400/300.jpg',
      title: 'Customer Reviews', 
      description: 'Honest feedback from real service experiences' 
    },
    { 
      image: 'https://picsum.photos/seed/tracking/400/300.jpg',
      title: 'Real-time Tracking', 
      description: 'Watch your service progress live on the map' 
    },
    { 
      image: 'https://picsum.photos/seed/booking/400/300.jpg',
      title: 'Instant Booking', 
      description: 'Book services instantly with confirmed availability' 
    },
    { 
      image: 'https://picsum.photos/seed/payments/400/300.jpg',
      title: 'Secure Payments', 
      description: 'Multiple payment options with full security' 
    },
  ]

  const stats = [
    { number: '10,000+', label: 'Service Providers' },
    { number: '50,000+', label: 'Happy Customers' },
    { number: '100,000+', label: 'Services Completed' },
    { number: '4.8/5', label: 'Average Rating' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1604076916888-b3217b1b3b1a?w=1920&h=1080&fit=crop"
            alt="ServiceHive Professional Services Platform"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl lg:text-7xl font-bold mb-6"
            >
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="gradient-text"
              >
                Find Trusted Services
              </motion.span>
              <br />
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-white"
              >
                At Your Fingertips
              </motion.span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Connect with verified service providers in your area
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="group">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
              <Button variant="outline" size="lg">
                Browse Services
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold gradient-text mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Popular Services
            </h2>
            <p className="text-xl text-gray-300">
              Explore our wide range of professional services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  filter: 'blur(0px)'
                }}
                className="group relative overflow-hidden glass-card rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.name}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:blur-sm group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{service.name}</h3>
                  <p className="text-gray-400">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose ServiceHive?
            </h2>
            <p className="text-xl text-gray-300">
              Experience the difference with our platform features
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  filter: 'blur(0px)'
                }}
                className="group glass-card p-6 rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all duration-300"
              >
                <div className="relative h-32 overflow-hidden rounded-lg mb-4">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:blur-sm group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center p-12 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-cyan-500/20">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of satisfied customers and service providers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg">
                  Sign Up Now
                </Button>
              </Link>
              <Link to="/browse-services">
                <Button variant="outline" size="lg">
                  Browse Services
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
