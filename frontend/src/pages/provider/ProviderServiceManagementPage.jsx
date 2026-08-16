import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  DollarSign
} from 'lucide-react'

import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { 
  addProviderService, 
  getServicesByProvider, 
  updateService, 
  deleteService,
  getServiceCategories 
} from '../../data/providerServices'

const ProviderServiceManagementPage = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    price: '',
    priceUnit: 'hour',
    location: '',
    responseTime: '',
    services: [],
    experience: ''
  })

  // Mock current provider (in real app, this would come from auth)
  const currentProvider = {
    id: 'provider1',
    name: 'John Smith',
    email: 'john@example.com'
  }

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = () => {
    const providerServices = getServicesByProvider(currentProvider.id)
    setServices(providerServices)
    setLoading(false)
  }

  const serviceCategories = getServiceCategories()

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const serviceData = {
      ...formData,
      providerId: currentProvider.id,
      providerName: currentProvider.name,
      providerEmail: currentProvider.email,
      price: parseFloat(formData.price),
      verified: true,
      rating: 4.5,
      reviews: 0
    }

    if (editingService) {
      updateService(editingService.id, serviceData)
    } else {
      addProviderService(serviceData)
    }

    resetForm()
    loadServices()
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      categoryId: '',
      price: '',
      priceUnit: 'hour',
      location: '',
      responseTime: '',
      services: [],
      experience: ''
    })
    setShowAddForm(false)
    setEditingService(null)
  }

  const handleEdit = (service) => {
    setEditingService(service)
    setFormData({
      title: service.title,
      description: service.description,
      categoryId: service.categoryId,
      price: service.price.toString(),
      priceUnit: service.priceUnit,
      location: service.location,
      responseTime: service.responseTime,
      services: service.services,
      experience: service.experience
    })
    setShowAddForm(true)
  }

  const handleDelete = (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      deleteService(serviceId)
      loadServices()
    }
  }

  const handleServicesChange = (value) => {
    const services = value.split(',').map(s => s.trim()).filter(s => s)
    setFormData({ ...formData, services })
  }

  if (loading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-4">Loading services...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500/20 blur-[140px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/20 blur-[140px] rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/provider/dashboard" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-custom-yellow transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">My Services</h1>
              <p className="text-gray-400">Manage the services you offer to customers</p>
            </div>
            <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New Service
            </Button>
          </div>
        </div>

        {/* Add/Edit Service Form */}
        {showAddForm && (
          <Card className="p-6 mb-8 bg-white/5 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingService ? 'Edit Service' : 'Add New Service'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Service Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-custom-yellow"
                    placeholder="e.g., Professional Home Plumbing"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Service Category
                  </label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-custom-yellow"
                  >
                    <option value="">Select a category</option>
                    {Object.entries(serviceCategories).map(([id, name]) => (
                      <option key={id} value={id}>{name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-custom-yellow"
                  rows={4}
                  placeholder="Describe your service in detail..."
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-custom-yellow"
                    placeholder="50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price Unit
                  </label>
                  <select
                    value={formData.priceUnit}
                    onChange={(e) => setFormData({ ...formData, priceUnit: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-custom-yellow"
                  >
                    <option value="hour">per hour</option>
                    <option value="session">per session</option>
                    <option value="project">per project</option>
                    <option value="day">per day</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Experience
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-custom-yellow"
                    placeholder="e.g., 5+ years"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-custom-yellow"
                    placeholder="e.g., Downtown District"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Response Time
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.responseTime}
                    onChange={(e) => setFormData({ ...formData, responseTime: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-custom-yellow"
                    placeholder="e.g., 30 min"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Services Offered (comma-separated)
                </label>
                <input
                  type="text"
                  required
                  value={formData.services.join(', ')}
                  onChange={(e) => handleServicesChange(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-custom-yellow"
                  placeholder="e.g., Plumbing Repair, Installation, Emergency Services"
                />
              </div>

              
              <div className="flex gap-4">
                <Button type="submit">
                  {editingService ? 'Update Service' : 'Add Service'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Services List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 bg-white/5 border border-white/10 hover:border-custom-yellow transition-all duration-300">
                {/* Service Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-white">{service.title}</h3>
                      {service.verified && (
                        <CheckCircle className="w-4 h-4 text-custom-yellow" />
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{serviceCategories[service.categoryId]}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-white">{service.rating}</span>
                        <span className="text-gray-400">({service.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400">{service.responseTime}</span>
                      </div>
                    </div>
                  </div>
                                  </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                  <MapPin className="w-4 h-4" />
                  {service.location}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-300 mb-4 line-clamp-2">
                  {service.description}
                </p>

                {/* Services */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {service.services.map((serviceItem, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-custom-yellow/10 text-custom-yellow rounded text-xs"
                    >
                      {serviceItem}
                    </span>
                  ))}
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-4 h-4 text-custom-yellow" />
                  <span className="text-lg font-semibold text-custom-yellow">
                    ${service.price}/{service.priceUnit}
                  </span>
                </div>

                {/* Experience */}
                <div className="text-sm text-gray-400 mb-4">
                  Experience: {service.experience}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => handleEdit(service)}
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1 text-red-400 border-red-400/20 hover:bg-red-500/10"
                    onClick={() => handleDelete(service.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* No Services Message */}
        {services.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-white mb-2">No services added yet</h3>
            <p className="text-gray-400 mb-6">Start adding services to attract customers.</p>
            <Button onClick={() => setShowAddForm(true)}>
              Add Your First Service
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProviderServiceManagementPage
