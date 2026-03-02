import React from 'react'
import { motion } from 'framer-motion'
import { 
  Users, Target, Shield, Award, Clock, MapPin,
  Heart, Lightbulb, Zap, CheckCircle, ArrowRight
} from 'lucide-react'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'

const AboutPage = () => {
  const values = [
    {
      icon: Shield,
      title: 'Trust & Safety',
      description: 'We verify all service providers and implement strict safety measures to protect our community.'
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'Building a community where customers and providers can connect and thrive together.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Constantly improving our platform with cutting-edge technology and user feedback.'
    },
    {
      icon: Heart,
      title: 'Customer Care',
      description: 'Dedicated support team available 24/7 to help you with any questions or concerns.'
    }
  ]

  const stats = [
    { number: '50,000+', label: 'Active Users', icon: Users },
    { number: '10,000+', label: 'Service Providers', icon: Users },
    { number: '100,000+', label: 'Completed Services', icon: CheckCircle },
    { number: '4.8/5', label: 'Average Rating', icon: Award }
  ]

  const timeline = [
    {
      year: '2020',
      title: 'ServiceHive Founded',
      description: 'Started with a simple mission to connect people with trusted service providers.'
    },
    {
      year: '2021',
      title: 'Platform Launch',
      description: 'Launched our beta version with 100+ service providers across 5 cities.'
    },
    {
      year: '2022',
      title: 'Rapid Growth',
      description: 'Expanded to 50+ cities and onboarded 1,000+ verified service providers.'
    },
    {
      year: '2023',
      title: 'Technology Upgrade',
      description: 'Introduced real-time tracking, AI-powered matching, and enhanced security features.'
    },
    {
      year: '2024',
      title: 'Market Leader',
      description: 'Became the leading on-demand service marketplace with 50,000+ active users.'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl lg:text-7xl font-bold mb-6"
            >
              <span className="gradient-text">About ServiceHive</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              We're on a mission to make quality services accessible to everyone, 
              everywhere. Connecting trusted professionals with customers who need them.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold gradient-text mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                To revolutionize the service industry by creating a seamless, 
                trustworthy platform that connects customers with top-rated service 
                providers while ensuring quality, safety, and convenience for everyone.
              </p>
              <p className="text-lg text-gray-300 mb-8">
                We believe that everyone deserves access to reliable services, 
                and every skilled professional deserves the opportunity to showcase 
                their talents and grow their business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg">
                  Join Our Mission
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-8">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Target className="w-6 h-6 text-cyan-500 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Our Vision</h3>
                      <p className="text-gray-400">
                        To become the world's most trusted and comprehensive service marketplace.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Zap className="w-6 h-6 text-purple-500 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Our Approach</h3>
                      <p className="text-gray-400">
                        Using technology to simplify the process of finding and booking services.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Clock className="w-6 h-6 text-pink-500 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Our Promise</h3>
                      <p className="text-gray-400">
                        Quality services, verified providers, and exceptional customer support.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-300">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card key={index} delay={index * 0.1}>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-400">
                      {value.description}
                    </p>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-300">
              From startup to market leader
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-cyan-500 to-purple-500"></div>
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <Card className="p-6 inline-block text-left">
                      <div className="text-cyan-500 font-semibold mb-2">{item.year}</div>
                      <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                      <p className="text-gray-400">{item.description}</p>
                    </Card>
                  </div>
                  
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full border-4 border-dark"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
