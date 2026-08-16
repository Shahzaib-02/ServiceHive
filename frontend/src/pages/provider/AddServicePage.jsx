import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import { useServices } from '../../hooks/useServices'
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import MultiImageUploadField from "../../components/forms/MultiImageUploadField";
import {
  serviceGroups,
  serviceCategories,
  categoriesInGroup,
} from '../../data/catalog'
import {
  createServiceRequest,
} from '../../services/api/servicesApi'

const AddServicePage = () => {
  const { token, user } = useAuth()
  const { services, fetchServices } = useServices()
  const navigate = useNavigate()
  const [imageFiles, setImageFiles] = useState([])
  const [imageError, setImageError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [locationSearch, setLocationSearch] = useState('')
  
  // Success message state
  const [successMessage, setSuccessMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    group: '',
    category: '',
    basePrice: '',
    eta: '',
    availability: '',
    location: '',
    description: '',
  })

  // Check if provider already has a service
  const ownServices = services.filter((service) => 
    String(service.providerId) === String(user?.id) || 
    String(service.providerIdStr) === String(user?.id)
  )
  
  const hasAnyService = ownServices.length > 0

  useEffect(() => {
    fetchServices({ search: '', category: '', group: '' })
  }, [fetchServices])

  useEffect(() => {
    if (user?.id && hasAnyService) {
      navigate('/provider/manage-services', { replace: true })
    }
  }, [user?.id, hasAnyService, navigate])

  const handleGroupChange = (e) => {
    const group = e.target.value
    setFormData(prev => ({
      ...prev,
      group,
      category: ''
    }))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLocationSelectFromMap = (location) => {
    setFormData(prev => ({
      ...prev,
      location: location.name
    }))
    setSelectedLocation(location)
    setShowMap(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setImageError('')
    
    try {
      // Validate images first
      if (imageFiles.length < 2) {
        setImageError('Please upload at least 2 photos')
        setIsSubmitting(false)
        return
      }
      if (imageFiles.length > 5) {
        setImageError('Maximum 5 photos allowed')
        setIsSubmitting(false)
        return
      }

      const categoryDetails = serviceCategories.find((category) => category.id === formData.category)
      
      const images = await Promise.all(imageFiles.map((f) => {
        const reader = new FileReader()
        return new Promise((resolve) => {
          reader.onload = () => resolve(reader.result)
          reader.readAsDataURL(f)
        })
      }))
      
      const serviceData = {
        title: formData.title,
        category: formData.category,
        basePrice: parseFloat(formData.basePrice),
        price: parseFloat(formData.basePrice),
        eta: formData.eta || '1 hour',
        description: formData.description,
        images,
        categoryLabel: categoryDetails?.title || '',
        group: formData.group,
        availability: formData.availability,
        location: formData.location,
        slug: formData.category,
        status: 'pending',
        serviceArea: formData.location,
        requirements: '',
        features: [],
        keywords: [],
      }
      
      const authHeaders = {
        Authorization: `Bearer ${token}`
      }
      
      await createServiceRequest(serviceData, authHeaders)
      
      setSuccessMessage('Service created successfully! Your service has been submitted for admin approval.')
      setMessageType('success')
      
      // Reset form
      setFormData({
        title: '',
        group: '',
        category: '',
        basePrice: '',
        eta: '',
        availability: '',
        location: '',
        description: '',
      })
      setImageFiles([])
      setImageError('')
      
      // Navigate to manage services after success
      setTimeout(() => {
        navigate('/provider/manage-services')
      }, 2000)
      
    } catch (error) {
      console.error('Error creating service:', error)
      setImageError(error.message || 'Failed to create service')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      title: '',
      group: '',
      category: '',
      basePrice: '',
      eta: '',
      availability: '',
      location: '',
      description: '',
    })
    setImageFiles([])
    setImageError('')
  }

  // Dynamic locations for Bahawalpur
  const bahawalpurLocations = [
    { id: 'loc1', name: 'University Chowk', type: 'area' },
    { id: 'loc2', name: 'Model Town', type: 'town' },
    { id: 'loc3', name: 'Satellite Town', type: 'town' },
    { id: 'loc4', name: 'Muslim Town', type: 'town' },
    { id: 'loc5', name: 'DHA Bahawalpur', type: 'colony' },
    { id: 'loc6', name: 'Railway Colony', type: 'colony' },
    { id: 'loc7', name: 'Jinnah Colony', type: 'colony' },
    { id: 'loc8', name: 'Iqbal Colony', type: 'colony' },
    { id: 'loc9', name: 'Sadiq Colony', type: 'colony' },
    { id: 'loc10', name: 'Bilal Colony', type: 'colony' },
       { id: 'loc11', name: 'Japan Town', type: 'Town' },
  ]

  const filteredLocations = bahawalpurLocations.filter(location =>
    location.name.toLowerCase().includes(locationSearch.toLowerCase())
  )

  if (hasAnyService) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-xl font-bold text-white mb-4">Service Limit Reached</h2>
          <p className="text-gray-400 mb-6">You can only create one service as a provider. Please manage your existing service.</p>
          <Button onClick={() => navigate('/provider/manage-services')}>
            Manage Your Service
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg flex items-center gap-3 ${
            messageType === 'success' 
              ? 'bg-green-500/20 border border-green-500/50 text-green-400' 
              : 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-400'
          }`}
        >
          <p className="text-sm">{successMessage}</p>
          <button
            onClick={() => setSuccessMessage('')}
            className="ml-auto"
          >
            ×
          </button>
        </motion.div>
      )}
      
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-white">Create a service listing</h1>
        <p className="text-slate-400">Choose a service group, then a subcategory. Add pricing, availability, 2–5 photos, and a description.</p>
      </div>
      
      <Card className="p-8" hover={false}>
        <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
          <div>
            <Input
              name="title"
              label="Service title"
              placeholder="e.g. Same-day AC gas refill"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Select
              name="group"
              label="Service group"
              value={formData.group}
              onChange={handleGroupChange}
              options={serviceGroups.map((g) => ({ value: g.id, label: `${g.emoji} ${g.label}` }))}
              required
            />
          </div>

          <div>
            <Select
              name="category"
              label="Subcategory"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              options={
                formData.group 
                  ? categoriesInGroup(formData.group).map((c) => ({ value: c.id, label: c.title }))
                  : []
              }
              required
            />
          </div>

          <div>
            <Input
              name="basePrice"
              label="Starting price"
              placeholder="1000"
              type="number"
              value={formData.basePrice}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Input
              name="availability"
              label="Availability"
              placeholder="mon-fri"
              value={formData.availability}
              onChange={handleInputChange}
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Location (Bahawalpur Only)
            </label>
            <div className="relative">
              <Input
                name="location"
                value={formData.location}
                onClick={() => setShowMap(true)}
                placeholder="Select Bahawalpur location..."
                readOnly
                className="cursor-pointer"
              />
            </div>
            {showMap && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute z-50 w-full mt-3"
              >
                <Card className="p-5 shadow-2xl" hover={false}>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 bg-gradient-to-br from-custom-yellow/20 to-amber-500/20 rounded-xl flex items-center justify-center">
                        <span className="text-custom-yellow">📍</span>
                      </div>
                      <h3 className="text-white font-semibold text-lg">Select Bahawalpur Location</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowMap(false)}
                      className="p-2 rounded-xl hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                    >
                      ×
                    </button>
                  </div>

                  <div className="max-h-56 overflow-y-auto space-y-1.5">
                    {filteredLocations.length > 0 ? (
                      <div className="space-y-1.5">
                        {filteredLocations.map((location) => (
                          <button
                            key={location.id}
                            type="button"
                            onClick={() => handleLocationSelectFromMap(location)}
                            className="w-full text-left px-3.5 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-200 flex items-center justify-between border border-transparent hover:border-white/10"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                                location.type === 'colony' ? 'bg-blue-500/10 text-blue-400' :
                                location.type === 'town' ? 'bg-emerald-500/10 text-emerald-400' :
                                'bg-purple-500/10 text-purple-400'
                              }`}>
                                📍
                              </div>
                              <div className="flex-1">
                                <span className="text-white font-medium block">{location.name}</span>
                                <span className="text-slate-400 text-xs capitalize">{location.type}</span>
                              </div>
                            </div>
                            <span className="text-slate-500 group-hover:text-custom-yellow transition-colors">→</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-3">
                          📍
                        </div>
                        <p className="text-slate-300 font-medium">No locations found</p>
                        <p className="text-slate-500 text-xs mt-1">Try adjusting your search</p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}
          </div>

          <div className="sm:col-span-2">
            <MultiImageUploadField
              label="Service photos"
              min={2}
              max={5}
              files={imageFiles}
              onChange={setImageFiles}
              error={imageError}
            />
          </div>

          <div className="sm:col-span-2">
            <Input
              name="description"
              label="Short summary"
              placeholder="Describe service outcome and value."
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="sm:col-span-2 flex flex-wrap gap-3">
            <Button
              variant='outline'
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Publishing...' : 'Publish service'}
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={handleCancel}
            >
              Reset form
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default AddServicePage
