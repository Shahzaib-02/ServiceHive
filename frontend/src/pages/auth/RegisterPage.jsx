

import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, Briefcase, XCircle, CheckCircle, Clock } from 'lucide-react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import { useAuth } from '../../hooks/useAuth'
import PortalToast from '../../components/ui/PortalToast'

// Helper to check if value is a valid File object
  const isValidFile = (value) => {
    return value && typeof value === 'object' && value instanceof File && value.name
  }

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()
  const [submitCount, setSubmitCount] = useState(0)
  const [registerError, setRegisterError] = useState('')
  const [toast, setToast] = useState({ message: '', type: 'error', isVisible: false })
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null)
  const { register } = useAuth()

  // Cleanup object URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl)
      }
    }
  }, [imagePreviewUrl])

  const showToast = (message, type = 'error') => {
    setToast({ message, type, isVisible: true })
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }))
    }, 5000)
  }

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }))
  }

  // Simple auto-fill prevention that allows user input
  useEffect(() => {
    const clearAutoFill = () => {
      const emailInput = document.querySelector('input[type="email"]')
      const passwordInputs = document.querySelectorAll('input[type="password"]')
      const fileInputs = document.querySelectorAll('input[type="file"]')
      
      // Only clear if user hasn't interacted with the field
      if (emailInput && emailInput.value && !emailInput.dataset.userInteracted) {
        emailInput.value = ''
      }
      passwordInputs.forEach(input => {
        if (input.value && !input.dataset.userInteracted) {
          input.value = ''
        }
      })
      // Don't try to set value on file inputs - just clear them if needed
      fileInputs.forEach(input => {
        if (input.files && input.files.length > 0 && !input.dataset.userInteracted) {
          // Clear file input by resetting the files array
          input.files = null
        }
      })
    }

    // Clear on mount and after delays
    clearAutoFill()
    const timeouts = [100, 500, 1000, 2000].map(delay => 
      setTimeout(clearAutoFill, delay)
    )

    // Mark user interaction
    const handleUserInteraction = (e) => {
      e.target.dataset.userInteracted = 'true'
    }

    // Add listeners for user interaction
    const emailInput = document.querySelector('input[type="email"]')
    const passwordInputs = document.querySelectorAll('input[type="password"]')
    const fileInputs = document.querySelectorAll('input[type="file"]')
    
    if (emailInput) {
      emailInput.addEventListener('focus', handleUserInteraction)
      emailInput.addEventListener('keydown', handleUserInteraction)
    }
    passwordInputs.forEach(input => {
      if (input) {
        input.addEventListener('focus', handleUserInteraction)
        input.addEventListener('keydown', handleUserInteraction)
      }
    })
    fileInputs.forEach(input => {
      if (input) {
        input.addEventListener('focus', handleUserInteraction)
        input.addEventListener('keydown', handleUserInteraction)
      }
    })

    return () => {
      timeouts.forEach(clearTimeout)
      if (emailInput) {
        emailInput.removeEventListener('focus', handleUserInteraction)
        emailInput.removeEventListener('keydown', handleUserInteraction)
      }
      passwordInputs.forEach(input => {
        if (input) {
          input.removeEventListener('focus', handleUserInteraction)
          input.removeEventListener('keydown', handleUserInteraction)
        }
      })
      fileInputs.forEach(input => {
        if (input) {
          input.removeEventListener('focus', handleUserInteraction)
          input.removeEventListener('keydown', handleUserInteraction)
        }
      })
    }
  }, [])

  // Save form data to localStorage
  const saveFormData = (values) => {
    // Create a copy without the file object (File cannot be serialized)
    const valuesToSave = { ...values }
    delete valuesToSave.cnicImage  // Don't save file to localStorage
    localStorage.setItem('registerFormData', JSON.stringify(valuesToSave))
  }

  // Load form data from localStorage
  const loadFormData = () => {
    try {
      const savedData = localStorage.getItem('registerFormData')
      const baseData = {
        name: '',
        email: '',
        phone: '',
        cnic: '',
        password: '',
        confirmPassword: '',
        role: '',
        cnicImage: null  // Always null — File cannot be loaded from localStorage
      }
      if (savedData) {
        const parsed = JSON.parse(savedData)
        // Merge saved data but keep cnicImage as null
        return { ...baseData, ...parsed, cnicImage: null }
      }
      return baseData
    } catch (error) {
      console.error('Error loading form data:', error)
      return {
        name: '',
        email: '',
        phone: '',
        cnic: '',
        password: '',
        confirmPassword: '',
        role: '',
        cnicImage: null
      }
    }
  }

  const registerValidationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .required('Full name is required'),
    email: Yup.string()
      .email('Please enter a valid email address')
      .required('Email is required'),
    phone: Yup.string()
      .matches(/^[0-9]{11}$/, 'Phone number must be 11 digits')
      .required('Phone number is required'),
    cnic: Yup.string()
      .matches(/^[0-9]{13}$/, 'CNIC must be 13 digits without dashes')
      .required('CNIC is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords do not match')
      .required('Please confirm your password'),
    role: Yup.string()
      .oneOf(['customer', 'provider'], 'Please select a valid role')
      .required('Please select your role'),
    cnicImage: Yup.mixed().nullable()
    .test('requiredForProvider', 'CNIC image is required for service providers', function(value) {
      const { role } = this.parent
      if (role === 'provider') {
        return !!value
      }
      return true
    })
    .test('fileType', 'Only image files are allowed (JPG, PNG, GIF)', (value) => {
      // Allow null/undefined values (field is optional)
      if (!value || value === '') return true
      
      // Debug logging
      console.log('File validation debug:', {
        value,
        fileName: value?.name,
        fileType: value?.type,
        fileSize: value?.size,
        isFile: value instanceof File
      })
      
      // Check if it's a File object first
      if (!(value instanceof File)) {
        console.error('Value is not a File object:', value)
        return false
      }
      
      // Check MIME type first (most reliable)
      if (value.type && value.type.startsWith('image/')) {
        console.log('File validated by MIME type:', value.type)
        return true
      }
      
      // Fallback: check file extension if MIME type is missing or incorrect
      const fileName = value.name.toLowerCase()
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp']
      const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext))
      
      if (hasValidExtension) {
        console.log('File validated by extension:', fileName)
        return true
      }
      
      console.error('Invalid file - neither MIME type nor extension is valid:', {
        type: value.type,
        name: value.name
      })
      
      return false
    })
    .test('fileSize', 'CNIC image must be smaller than 5MB', (value) => {
      if (!value) return true
      return value.size <= 5 * 1024 * 1024 // 5MB limit
    })
  })

  const handleSubmit = async (values, { setSubmitting, validateForm, setErrors }) => {
    try {
      // Force validation to show errors
      const errors = await validateForm()
      
      if (Object.keys(errors).length > 0) {
        setErrors(errors)
        setSubmitting(false)
        return
      }
      
      // Prepare registration data for API
      const registrationData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        cnic: values.cnic,
        role: values.role,
        password: values.password,
        city: '', // Add city field if needed
        cnicFileName: values.cnicImage?.name || '',
        cnicDocumentDataUrl: values.cnicImage && typeof values.cnicImage === 'object' ? '' : (values.cnicImage || '')
      }
      
      // Call API registration
      const response = await register(registrationData)
      
      // Clear form data after successful registration
      localStorage.removeItem('registerFormData')
      
      // Navigate to login with success message
      const successMessage = response.pendingApproval 
        ? 'Registration submitted successfully! Your account is pending admin approval. You will be notified once approved.'
        : 'Registration successful! You can now login.'
      
      navigate('/login', { 
        state: { 
          message: successMessage,
          role: values.role,
          requiresApproval: response.pendingApproval
        } 
      })
    } catch (error) {
      // Show toast message for all registration errors
      showToast('Registration failed. Please check your information and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-2xl min-w-0"
      >
        <Card className="  overflow-hidden min-w-0">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-custom-yellow to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User className="w-16 h-16 text-yellow-400" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-custom-yellow to-orange-500 bg-clip-text text-transparent">Create <span className='text-yellow-400'>Account</span></h1>
            <p className="text-gray-300 text-lg">Join ServiceHive today</p>
          </div>

          
          <Formik
            initialValues={loadFormData()}
            validationSchema={registerValidationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            {({ isSubmitting, errors, touched, values, submitCount, validateForm, setErrors, setValues, setFieldValue }) => {
              // Save form data whenever values change
              const handleFormChange = (e) => {
                // Clear error when user starts typing
                if (registerError) {
                  setRegisterError('')
                }
                const { name, value, files } = e.target
                
                // Handle file inputs separately
                if (name === 'cnicImage' && files && files.length > 0) {
                  setValues(prev => {
                    const newValues = { ...prev, [name]: files[0] }
                    saveFormData(newValues)
                    return newValues
                  })
                } else if (name !== 'cnicImage') {
                  // Handle other inputs normally
                  setValues(prev => {
                    const newValues = { ...prev, [name]: value }
                    saveFormData(newValues)
                    return newValues
                  })
                }
              }

              return (
                <Form 
                  className="space-y-4" 
                  onChange={handleFormChange}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  style={{ display: 'inline-block' }}
                >
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-3">
                    I am a
                  </label>
                  <Field
                    as="select"
                    name="role"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-yellow focus:border-custom-yellow transition-all duration-200 shadow-lg"
                  >
                    <option value="">Select your role</option>
                    <option value="customer">Customer</option>
                    <option value="provider">Service Provider</option>
                  </Field>
                  {(errors.role && (touched.role || submitCount > 0)) && (
                    <p className="mt-2 text-sm text-red-400">{errors.role}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Field
                        type="text"
                        name="name"
                        placeholder="Enter your full name"
                        pattern="[A-Za-z\s]+"
                        title="Name should only contain letters and spaces"
                        className={`w-full px-4 py-3 pl-10 bg-gray-800/50 border ${errors.name && (touched.name || submitCount > 0) ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-yellow focus:border-custom-yellow transition-all duration-200`}
                      />
                    </div>
                    {(errors.name && (touched.name || submitCount > 0)) && (
                        <p className="mt-2 text-sm text-red-400">{errors.name}</p>
                      )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Field
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$"
                        title="Please enter a valid email address"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        className={`w-full px-4 py-3 pl-10 bg-gray-800/50 border ${errors.email && (touched.email || submitCount > 0) ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-yellow focus:border-custom-yellow transition-all duration-200`}
                      />
                    </div>
                    {(errors.email && (touched.email || submitCount > 0)) && (
                      <p className="mt-2 text-sm text-red-400">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Field
                        type="tel"
                        name="phone"
                        placeholder="03xxxxxxxxx"
                        pattern="03[0-9]{9}"
                        title="Phone number must start with 03 and be 11 digits"
                        className={`w-full px-4 py-3 pl-10 bg-gray-800/50 border ${errors.phone && (touched.phone || submitCount > 0) ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-yellow focus:border-custom-yellow transition-all duration-200`}
                      />
                    </div>
                    {(errors.phone && (touched.phone || submitCount > 0)) && (
                        <p className="mt-2 text-sm text-red-400">{errors.phone}</p>
                      )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      CNIC Number
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Field
                        type="text"
                        name="cnic"
                        placeholder="xxxxxxxxxxxxx"
                        pattern="[0-9]{13}"
                        title="CNIC must be 13 digits without dashes"
                        className={`w-full px-4 py-3 pl-10 bg-gray-800/50 border ${errors.cnic && (touched.cnic || submitCount > 0) ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-yellow focus:border-custom-yellow transition-all duration-200`}
                      />
                    </div>
                    {(errors.cnic && (touched.cnic || submitCount > 0)) && (
                        <p className="mt-2 text-sm text-red-400">{errors.cnic}</p>
                      )}
                  </div>
                </div>

                {values.role === 'provider' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      CNIC Image
                    </label>

                    {/* Hidden real file input */}
                    <input
                      type="file"
                      id="cnicImageInput"
                      name="cnicImage"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(event) => {
                        const file = event.currentTarget.files[0];
                        if (file) {
                          setFieldValue('cnicImage', file);
                          if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
                          setImagePreviewUrl(URL.createObjectURL(file));
                        }
                      }}
                    />

                    {/* Custom file input button - shows filename */}
                    <div 
                      className={`flex items-center gap-3 px-4 py-3 bg-gray-800/50 border ${errors.cnicImage && (touched.cnicImage || submitCount > 0) ? 'border-red-500' : 'border-gray-600'} rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors`}
                      onClick={() => document.getElementById('cnicImageInput').click()}
                    >
                      <User className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-white truncate flex-1">
                        {isValidFile(values.cnicImage) 
                          ? values.cnicImage.name 
                          : 'Click to choose file'
                        }
                      </span>
                      <span className="text-xs text-custom-yellow flex-shrink-0">
                        {isValidFile(values.cnicImage) 
                          ? `${(values.cnicImage.size / 1024).toFixed(1)} KB ✓` 
                          : 'No file selected'
                        }
                      </span>
                    </div>

                    {/* Show file name when selected */}
                    {/* {isValidFile(values.cnicImage) && (
                      <div className="mt-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-gray-300">
                          {values.cnicImage.name} ({(values.cnicImage.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                    )} */}

                    {/* Show image preview */}
                    {imagePreviewUrl && values.cnicImage instanceof File && (
                      <div className="mt-3">
                        <div className="relative inline-block">
                          <img
                            src={imagePreviewUrl}
                            alt="CNIC Preview"
                            className="w-32 h-32 object-cover rounded-lg border border-gray-600"
                            onError={(e) => {
                              console.error('Image preview error:', e);
                              e.target.style.display = 'none';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFieldValue('cnicImage', null);
                              if (imagePreviewUrl) {
                                URL.revokeObjectURL(imagePreviewUrl);
                                setImagePreviewUrl(null);
                              }
                            }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {(errors.cnicImage && (touched.cnicImage || submitCount > 0)) && (
                        <p className="mt-2 text-sm text-red-400">{errors.cnicImage}</p>
                      )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Field
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Create a password"
                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
                        title="Password must be at least 8 characters with one uppercase, one lowercase, and one number"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        className={`w-full px-4 py-3 pl-10 pr-10 bg-gray-800/50 border ${errors.password && (touched.password || submitCount > 0) ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-yellow focus:border-custom-yellow transition-all duration-200`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {(errors.password && (touched.password || submitCount > 0)) && (
                        <p className="mt-2 text-sm text-red-400">{errors.password}</p>
                      )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Field
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        className={`w-full px-4 py-3 pl-10 pr-10 bg-gray-800/50 border ${errors.confirmPassword && (touched.confirmPassword || submitCount > 0) ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-yellow focus:border-custom-yellow transition-all duration-200`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {(errors.confirmPassword && (touched.confirmPassword || submitCount > 0)) && (
                        <p className="mt-2 text-sm text-red-400">{errors.confirmPassword}</p>
                      )}
                  </div>
                </div>

                

                <Button
                  type="submit"
                  variant='outline'
                  className="w-full py-3
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </Button>
              </Form>
              )
            }}
          </Formik>
        </Card>
      </motion.div>
      
      {/* Toast Notification rendered via portal to escape stacking contexts */}
      {toast.isVisible && (
        <PortalToast>
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed top-4 right-4 z-[9999] max-w-sm"
          >
            <div className={`p-4 rounded-lg shadow-lg flex items-center gap-3 ${
              toast.type === 'error' 
                ? 'bg-red-500/90 border border-red-500/50 text-white' 
                : toast.type === 'success'
                ? 'bg-green-500/90 border border-green-500/50 text-white'
                : 'bg-yellow-500/90 border border-yellow-500/50 text-white'
            }`}>
              {toast.type === 'error' ? (
                <XCircle className="w-5 h-5 flex-shrink-0" />
              ) : toast.type === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <Clock className="w-5 h-5 flex-shrink-0" />
              )}
              <p className="text-sm font-medium">{toast.message}</p>
              <button
                onClick={hideToast}
                className="ml-auto text-white/80 hover:text-white transition-colors"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </PortalToast>
      )}
    </>
  )
}

export default RegisterPage
