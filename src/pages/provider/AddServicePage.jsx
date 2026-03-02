import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, Upload, X, Camera, MapPin, Clock, DollarSign,
  FileText, CheckCircle, AlertCircle, Star, Users
} from 'lucide-react'
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";

const AddServicePage = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    price: '',
    duration: '',
    serviceArea: '',
    availability: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false
    },
    timeSlots: [],
    requirements: '',
    images: [],
    features: [],
    keywords: []
  })
  const [newFeature, setNewFeature] = useState('')
  const [newKeyword, setNewKeyword] = useState('')

  const categories = [
    { value: 'home', label: 'Home Services' },
    { value: 'beauty', label: 'Beauty & Wellness' },
    { value: 'tech', label: 'Tech Support' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'education', label: 'Education' },
    { value: 'business', label: 'Business Services' },
    { value: 'health', label: 'Health & Fitness' },
    { value: 'events', label: 'Events & Entertainment' }
  ]

  const durations = [
    { value: '30min', label: '30 minutes' },
    { value: '1hr', label: '1 hour' },
    { value: '2hr', label: '2 hours' },
    { value: '3hr', label: '3 hours' },
    { value: '4hr', label: '4 hours' },
    { value: 'custom', label: 'Custom duration' }
  ]

  const timeSlotOptions = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
  ]

  const steps = [
    { id: 1, title: 'Basic Info', description: 'Service details and description' },
    { id: 2, title: 'Pricing & Schedule', description: 'Set your rates and availability' },
    { id: 3, title: 'Media & Features', description: 'Add images and service features' },
    { id: 4, title: 'Review & Publish', description: 'Review and publish your service' }
  ]

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name.startsWith('availability.')) {
      const day = name.split('.')[1]
      setFormData({
        ...formData,
        availability: {
          ...formData.availability,
          [day]: checked
        }
      })
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      })
    }
  }

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()]
      })
      setNewFeature('')
    }
  }

  const handleRemoveFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    })
  }

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, newKeyword.trim()]
      })
      setNewKeyword('')
    }
  }

  const handleRemoveKeyword = (index) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter((_, i) => i !== index)
    })
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle service submission
    console.log('Service submitted:', formData)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Service Information</h3>
              <div className="space-y-4">
                <Input
                  label="Service Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Professional Home Cleaning"
                  required
                />
                
                <Select
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  options={categories}
                  required
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Service Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 glass-card border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                    placeholder="Describe your service in detail..."
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Minimum 50 characters. Be specific about what customers can expect.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Service Requirements
                  </label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 glass-card border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                    placeholder="Any special requirements or preparations needed..."
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Pricing & Duration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Base Price ($)"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="75"
                  icon={DollarSign}
                  required
                />
                
                <Select
                  label="Duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  options={durations}
                  icon={Clock}
                  required
                />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Service Area</h3>
              <Input
                label="Areas You Serve"
                name="serviceArea"
                value={formData.serviceArea}
                onChange={handleInputChange}
                placeholder="e.g., Manhattan, Brooklyn, Queens"
                icon={MapPin}
                required
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Availability</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {Object.keys(formData.availability).map((day) => (
                  <label key={day} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name={`availability.${day}`}
                      checked={formData.availability[day]}
                      onChange={handleInputChange}
                      className="w-4 h-4 bg-white/10 border-white/20 rounded text-cyan-500"
                    />
                    <span className="text-gray-300 capitalize">{day}</span>
                  </label>
                ))}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Available Time Slots
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {timeSlotOptions.map((time) => (
                    <label key={time} className="flex items-center">
                      <input
                        type="checkbox"
                        value={time}
                        checked={formData.timeSlots.includes(time)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              timeSlots: [...formData.timeSlots, time]
                            })
                          } else {
                            setFormData({
                              ...formData,
                              timeSlots: formData.timeSlots.filter(t => t !== time)
                            })
                          }
                        }}
                        className="w-4 h-4 bg-white/10 border-white/20 rounded text-cyan-500 mr-2"
                      />
                      <span className="text-gray-300 text-sm">{time}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Service Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {[1, 2, 3, 4].map((index) => (
                  <div key={index} className="aspect-square glass-card rounded-xl flex items-center justify-center border-2 border-dashed border-white/20">
                    <div className="text-center">
                      <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">Upload Image</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Upload Images
              </Button>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Service Features</h3>
              <div className="flex space-x-2 mb-4">
                <Input
                  placeholder="Add a feature..."
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                  className="flex-1"
                />
                <Button onClick={handleAddFeature}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="glass-card px-3 py-1 rounded-full flex items-center space-x-2">
                    <span className="text-sm text-gray-300">{feature}</span>
                    <button
                      onClick={() => handleRemoveFeature(index)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Keywords</h3>
              <div className="flex space-x-2 mb-4">
                <Input
                  placeholder="Add keywords..."
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                  className="flex-1"
                />
                <Button onClick={handleAddKeyword}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.keywords.map((keyword, index) => (
                  <div key={index} className="glass-card px-3 py-1 rounded-full flex items-center space-x-2">
                    <span className="text-sm text-gray-300">{keyword}</span>
                    <button
                      onClick={() => handleRemoveKeyword(index)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Review Your Service</h3>
              <p className="text-gray-400">Please review your service details before publishing</p>
            </div>

            <Card>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Service Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Title:</span>
                      <span className="text-white ml-2">{formData.title || 'Not set'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Category:</span>
                      <span className="text-white ml-2">{formData.category || 'Not set'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Price:</span>
                      <span className="text-white ml-2">${formData.price || 'Not set'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-white ml-2">{formData.duration || 'Not set'}</span>
                    </div>
                  </div>
                </div>

                {formData.description && (
                  <div>
                    <h4 className="font-semibold text-white mb-2">Description</h4>
                    <p className="text-gray-300 text-sm">{formData.description}</p>
                  </div>
                )}

                {formData.features.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-white mb-2">Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.features.map((feature, index) => (
                        <span key={index} className="glass-card px-3 py-1 rounded-full text-sm text-gray-300">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="glass-card p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    <div>
                      <p className="text-white text-sm font-medium">Publishing Guidelines</p>
                      <p className="text-gray-400 text-xs">
                        By publishing this service, you agree to our terms of service and community guidelines.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  currentStep >= step.id
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                    : 'glass-card text-gray-400'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="font-semibold">{step.id}</span>
                  )}
                </div>
                <span className={`text-xs mt-2 text-center ${
                  currentStep >= step.id ? 'text-white' : 'text-gray-400'
                }`}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${
                  currentStep > step.id ? 'bg-gradient-to-r from-cyan-500 to-purple-500' : 'bg-white/10'
                }`} />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="p-8">
          <form onSubmit={handleSubmit}>
            {renderStepContent()}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {currentStep < steps.length ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && (!formData.title || !formData.category || !formData.description)) ||
                    (currentStep === 2 && (!formData.price || !formData.duration || !formData.serviceArea))
                  }
                >
                  {currentStep === steps.length - 1 ? 'Publish Service' : 'Next'}
                </Button>
              ) : (
                <Button type="submit">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Publish Service
                </Button>
              )}
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}

export default AddServicePage
