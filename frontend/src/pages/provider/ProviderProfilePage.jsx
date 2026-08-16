import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, Mail, Phone, MapPin, Camera, Edit, Save, X,
  Star, Award, Calendar, Clock, CheckCircle, Upload,
  Shield, Globe, Languages, Briefcase, DollarSign
} from 'lucide-react'
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";

const ProviderProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    businessName: 'CleanPro Solutions',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@cleanpro.com',
    phone: '+1 234-567-8900',
    address: '123 Business Ave, New York, NY 10001',
    description: 'Professional cleaning services with over 5 years of experience. We specialize in residential and commercial cleaning, using eco-friendly products and modern equipment.',
    website: 'www.cleanpro.com',
    foundedYear: '2019',
    employees: '5-10',
    serviceArea: 'New York City Metropolitan Area',
    languages: ['English', 'Spanish'],
    responseTime: '1 hour',
        insurance: 'Fully Insured',
    license: 'Licensed & Bonded'
  })

  const languages = [
    { value: 'english', label: 'English' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'french', label: 'French' },
    { value: 'german', label: 'German' },
    { value: 'chinese', label: 'Chinese' }
  ]

  const employeeRanges = [
    { value: '1', label: 'Just me' },
    { value: '2-5', label: '2-5 employees' },
    { value: '5-10', label: '5-10 employees' },
    { value: '10-20', label: '10-20 employees' },
    { value: '20+', label: '20+ employees' }
  ]

  const stats = [
    { label: 'Total Jobs', value: '247', icon: Calendar },
    { label: 'Customer Rating', value: '4.8', icon: Star },
    { label: 'Years in Business', value: '5', icon: Award },
    { label: 'Response Rate', value: '95%', icon: Clock }
  ]

  const services = [
    { name: 'Home Cleaning', price: 'RS 75', duration: '2-3 hours' },
    { name: 'Deep Carpet Cleaning', price: 'RS 120', duration: '3-4 hours' },
    { name: 'Office Cleaning', price: 'RS 200', duration: '4-5 hours' },
    { name: 'Window Cleaning', price: 'RS 80', duration: '2 hours' }
  ]

  const reviews = [
    {
      id: 1,
      customer: 'Sarah Johnson',
      avatar: 'SJ',
      rating: 5,
      date: '2024-01-15',
      comment: 'Amazing service! Very professional and thorough. My apartment has never been cleaner.'
    },
    {
      id: 2,
      customer: 'Mike Chen',
      avatar: 'MC',
      rating: 4,
      date: '2024-01-10',
      comment: 'Great experience overall. Team was punctual and did a fantastic job.'
    },
    {
      id: 3,
      customer: 'Emily Davis',
      avatar: 'ED',
      rating: 5,
      date: '2024-01-05',
      comment: 'Reliable and affordable. Have been using them for months and always satisfied.'
    }
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = () => {
    setIsEditing(false)
    // Handle save logic
    console.log('Profile saved:', formData)
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset form data
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Business Profile</h1>
          <p className="text-gray-400">
            Manage your business information and public profile
          </p>
        </div>
        
        <Button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass-card p-6 rounded-xl text-center"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold gradient-text mb-1">{stat.value}</div>
            <div className="text-gray-400 text-sm">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Business Info */}
          <Card>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Business Information</h3>
              
              {/* Profile Picture */}
              <div className="flex items-center space-x-6 mb-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center">
                    <span className="text-white font-bold text-3xl">CP</span>
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
                      <Camera className="w-4 h-4 text-white" />
                    </button>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{formData.businessName}</h2>
                  <p className="text-gray-400">Professional Cleaning Services</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 text-sm">Verified Provider</span>
                  </div>
                </div>
              </div>

              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Business Name"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    icon={Briefcase}
                    disabled={!isEditing}
                  />
                  <Input
                    label="Website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    icon={Globe}
                    disabled={!isEditing}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    icon={Mail}
                    disabled={!isEditing}
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    icon={Phone}
                    disabled={!isEditing}
                  />
                </div>

                <Input
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  icon={MapPin}
                  disabled={!isEditing}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Business Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 glass-card border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                    disabled={!isEditing}
                  />
                </div>
              </form>
            </div>
          </Card>

          {/* Services */}
          <Card>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Services Offered</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service, index) => (
                  <div key={index} className="glass-card p-4 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">{service.name}</h4>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">{service.duration}</span>
                      <span className="text-cyan-400 font-semibold">{service.price}</span>
                    </div>
                  </div>
                ))}
              </div>
              {isEditing && (
                <Button variant="outline" className="w-full mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service
                </Button>
              )}
            </div>
          </Card>

          {/* Reviews */}
          <Card>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Customer Reviews</h3>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-white/10 pb-4 last:border-0">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-sm">{review.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-white">{review.customer}</h4>
                          <span className="text-sm text-gray-400">{review.date}</span>
                        </div>
                        <div className="flex items-center space-x-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-300 text-sm">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-6"
        >
          {/* Business Details */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Business Details</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Founded Year
                  </label>
                  <Input
                    name="foundedYear"
                    value={formData.foundedYear}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <Select
                  label="Team Size"
                  name="employees"
                  value={formData.employees}
                  onChange={handleChange}
                  options={employeeRanges}
                  disabled={!isEditing}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Service Area
                  </label>
                  <Input
                    name="serviceArea"
                    value={formData.serviceArea}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Languages
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {formData.languages.map((lang, index) => (
                      <span key={index} className="glass-card px-3 py-1 rounded-full text-sm text-gray-300">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </form>
            </div>
          </Card>

          {/* Verification */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Verifications</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-white text-sm font-medium">Insurance Verified</p>
                    <p className="text-gray-400 text-xs">Fully insured and bonded</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-white text-sm font-medium">License Verified</p>
                    <p className="text-gray-400 text-xs">Business license active</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-white text-sm font-medium">Background Checked</p>
                    <p className="text-gray-400 text-xs">All team members verified</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Performance */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Response Time</span>
                  <span className="text-white font-medium">{formData.responseTime}</span>
                </div>
                                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Completion Rate</span>
                  <span className="text-white font-medium">98%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">On-Time Rate</span>
                  <span className="text-white font-medium">95%</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex justify-end space-x-4"
        >
          <Button variant="outline" onClick={handleCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </motion.div>
      )}
    </div>
  )
}

export default ProviderProfilePage
