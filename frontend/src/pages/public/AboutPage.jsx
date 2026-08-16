import React from 'react'
import { motion } from 'framer-motion'
import { 
  Users, Target, Shield, Award, Clock, MapPin,
  Heart, Lightbulb, Zap, CheckCircle, ArrowRight
} from 'lucide-react'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import ServiceHiveLogo from '../../components/brand/ServiceHiveLogo'

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
    { number: '10,000+', label: 'Active Users', icon: Users },
  
    { number: '4.8/5', label: 'Average Rating', icon: Award }
  ]

  const timeline = [
    {
      year: '2025',
      title: 'ServiceHive Founded',
      description: 'Started with a vision to connect customers with trusted service providers in their local communities.'
    },
    {
      year: '2026',
      title: 'Platform Launch',
      description: 'Launched our innovative platform with advanced features and expanded to multiple service categories.'
    },
    {
      
      year: '2026',
      title: 'Market Leader',
      description: 'Became the leading on-demand service marketplace with  active users.'
    }
  ]

  return (
    <div className="min-h-screen ">
      <motion.h1 
                    className="text-4xl lg:text-5xl font-bold text-white mt-20 "
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                <div className='flex text-center justify-center'> About <span className="text-custom-yellow flex text-center justify-center ">{"\u00A0"} ServiceHive</span></div>   
                  </motion.h1>
      {/* Hero Section */}
      <section className="relative  py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 "></div>
        
        {/* Animated Background Elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-20 left-10 w-32 h-32 bg-custom-yellow/20 rounded-full blur-3xl"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
          className="absolute bottom-20 right-10 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl"
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-left"
            >
              <motion.div 
                className="inline-flex items-center mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.div 
                  className="w-16 h-16  rounded-xl flex items-center justify-center "
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                <div className="relative ">
                <ServiceHiveLogo className="h-10 w-10 transition-transform duration-300 group-hover:scale-110" />
              </div>
                </motion.div>
                <motion.div 
                  className="ml-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  
                  <motion.p 
                    className="text-xl text-gray-300 leading-relaxed max-w-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    Revolutionizing the service industry with innovative technology and trusted connections. 
                    We bridge the gap between skilled professionals and customers who need their expertise.
                  </motion.p>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                <motion.div 
                  className="flex items-start"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  whileHover={{ scale: 1.05, x: 10 }}
                >
                  <motion.div 
                    className="w-12 h-12 bg-yellow-400/10 rounded-lg flex items-center justify-center mr-4"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Users className="w-6 h-6 text-custom-yellow " />
                  </motion.div>
                  <div>
                    <motion.h3 
                      className="text-lg font-semibold text-white mb-2"
                      whileHover={{ color: "#FEBF25" }}
                      transition={{ duration: 0.2 }}
                    >10,000+ Users</motion.h3>
                    <p className="text-gray-400">Active users trust our platform daily</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  whileHover={{ scale: 1.05, x: 10 }}
                >
                  <motion.div 
                    className="w-12 h-12 bg-yellow-400/10 rounded-lg flex items-center justify-center mr-4"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Shield className="w-6 h-6 text-custom-yellow" />
                  </motion.div>
                  <div>
                    <motion.h3 
                      className="text-lg font-semibold text-white mb-2"
                      whileHover={{ color: "#FEBF25" }}
                      transition={{ duration: 0.2 }}
                    >Verified Providers</motion.h3>
                    <p className="text-gray-400">All service providers are thoroughly vetted</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                  whileHover={{ scale: 1.05, x: 10 }}
                >
                  <motion.div 
                    className="w-12 h-12 bg-yellow-400/10 rounded-lg flex items-center justify-center mr-4"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Award className="w-6 h-6 text-custom-yellow" />
                  </motion.div>
                  <div>
                    <motion.h3 
                      className="text-lg font-semibold text-white mb-2"
                      whileHover={{ color: "#FEBF25" }}
                      transition={{ duration: 0.2 }}
                    >4.8/5 Rating</motion.h3>
                    <p className="text-gray-400">Excellent customer satisfaction</p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
            
            {/* Right Column - Image */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              className="relative"
            >
              <motion.div 
                className="relative"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.div 
                  className="w-full h-96 bg-gradient-to-br from-custom-yellow/10 to-orange-500/10 rounded-2xl overflow-hidden shadow-2xl border border-yellow-400/10"
                  whileHover={{ scale: 1.02, borderColor: "rgba(254, 191, 37, 0.4)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div 
                      className="text-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, delay: 0.8 }}
                    >
                      <motion.div 
                        className="w-24 h-24  rounded-2xl flex items-center justify-center shadow-xl mb-6"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
               <div>
                <ServiceHiveLogo className="h-16 w-16" />
              </div>
                      </motion.div>
                      <motion.h2 
                        className="text-2xl font-bold text-white mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1 }}
                      >ServiceHive</motion.h2>
                      <motion.p 
                        className="text-lg text-gray-300 max-w-xs mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.2 }}
                      >
                        Your trusted partner for professional services
                      </motion.p>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
     
      {/* Values Section */}
      <section className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Our<span className="text-custom-yellow">  Core Values</span>
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
                    <div className="w-16 h-16 bg-yellow-400/10 border border-yellow-400/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-yellow-400" />
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
      <h2 className="text-4xl font-bold text-white mb-4">Our <span className="text-custom-yellow">Journey</span></h2>
      <p className="text-xl text-gray-300">From startup to market leader</p>
    </div>

    <div className="relative">
      {/* Vertical Line - Glowing gradient with fade edges */}
      <div className="absolute left-1/2 -translate-x-1/2 h-full w-[3px] z-[1]">
        {/* Main line */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, #fbbf24 8%, #f97316 50%, #fbbf24 92%, transparent 100%)",
          }}
        />
        {/* Glow layer behind */}
        <div
          className="absolute -inset-[2px] rounded-full blur-[4px] -z-10 opacity-60"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(251,191,36,0.5) 8%, rgba(249,115,22,0.4) 50%, rgba(251,191,36,0.5) 92%, transparent 100%)",
          }}
        />
      </div>

      <div className="space-y-12 relative z-10">
        {timeline.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative flex items-center ${
              index % 2 === 0 ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`w-5/12 ${
                index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"
              }`}
            >
              <Card className="p-6 inline-block text-left bg-black/50 rounded-xl">
                <div className="text-yellow-400 font-semibold mb-2">
                  {item.year}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-400">{item.description}</p>
              </Card>
            </div>

            {/* Center Dot - Glowing with pulse ring */}
            <div className="absolute left-1/2 -translate-x-1/2 z-20">
              <div
                className="relative w-5 h-5 rounded-full"
                style={{
                  background: "linear-gradient(135deg, #fbbf24, #f97316)",
                  border: "4px solid #111827",
                  boxShadow:
                    "0 0 0 3px rgba(251,191,36,0.25), 0 0 16px rgba(251,191,36,0.4), 0 0 32px rgba(249,115,22,0.2)",
                }}
              >
                {/* Pulse ring animation */}
                <span
                  className="absolute -inset-2 rounded-full border border-yellow-400/30 animate-ping"
                  style={{ animationDuration: "2.5s" }}
                />
              </div>
            </div>
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
