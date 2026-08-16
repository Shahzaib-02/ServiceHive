








import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, CheckCircle, Clock, XCircle } from 'lucide-react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Card from '../../components/ui/Card'
import Toast from '../../components/ui/Toast'
import { useAuth } from '../../hooks/useAuth'
import PortalToast from '../../components/ui/PortalToast'

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const [successMessage, setSuccessMessage] = useState('')
  const [messageType, setMessageType] = useState('success')
  const [loginError, setLoginError] = useState('')
  const [toast, setToast] = useState({ message: '', type: 'error', isVisible: false })
  const [emailFieldName] = useState(() => `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  const [passwordFieldName] = useState(() => `password_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  const { login } = useAuth()

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



  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message)
      setMessageType(location.state.requiresApproval ? 'warning' : 'success')
      // Clear state after showing message
      navigate(location.pathname, { replace: true })
    }
  }, [location.state, navigate])

  // Handle successful login redirect
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const redirectPath = params.get('redirect')
    const successMessage = params.get('message')
    const messageType = params.get('type')
    
    if (redirectPath && successMessage) {
      setSuccessMessage(decodeURIComponent(successMessage))
      setMessageType(messageType || 'success')
      
      // Clear URL params and redirect to role-specific dashboard
      navigate(redirectPath, { replace: true })
    }
  }, [location.search, navigate])

  // Simple auto-fill prevention that allows user input
  useEffect(() => {
    const clearAutoFill = () => {
      const emailInput = document.querySelector('input[type="email"]')
      const passwordInput = document.querySelector('input[type="password"]')
      
      // Only clear if user hasn't interacted with the field
      if (emailInput && emailInput.value && !emailInput.dataset.userInteracted) {
        emailInput.value = ''
        emailInput.setAttribute('value', '')
      }
      if (passwordInput && passwordInput.value && !passwordInput.dataset.userInteracted) {
        passwordInput.value = ''
        passwordInput.setAttribute('value', '')
      }
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
    const passwordInput = document.querySelector('input[type="password"]')
    
    if (emailInput) {
      emailInput.addEventListener('focus', handleUserInteraction)
      emailInput.addEventListener('keydown', handleUserInteraction)
    }
    if (passwordInput) {
      passwordInput.addEventListener('focus', handleUserInteraction)
      passwordInput.addEventListener('keydown', handleUserInteraction)
    }

    return () => {
      timeouts.forEach(clearTimeout)
      if (emailInput) {
        emailInput.removeEventListener('focus', handleUserInteraction)
        emailInput.removeEventListener('keydown', handleUserInteraction)
      }
      if (passwordInput) {
        passwordInput.removeEventListener('focus', handleUserInteraction)
        passwordInput.removeEventListener('keydown', handleUserInteraction)
      }
    }
  }, [])

  // Clear error when user starts typing
  const handleFieldChange = () => {
    if (loginError) {
      setLoginError('')
    }
  }

  // Save form data to localStorage
  const saveFormData = (values) => {
    localStorage.setItem('loginFormData', JSON.stringify(values))
  }

  // Load form data from localStorage
  const loadFormData = () => {
    try {
      const savedData = localStorage.getItem('loginFormData')
      return savedData ? JSON.parse(savedData) : { email: '', password: '', role: '' }
     } catch (error) {
      console.error('Error loading form data:', error)
      return { email: '', password: '', role: '' }
    }
  }

  const loginValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Please enter a valid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required'),
    role: Yup.string()
      .oneOf(['customer', 'provider', 'admin'], 'Please select a valid role')
      .required('Account type is required')
  })

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      // Call API login
      const response = await login({
        email: values.email,
        password: values.password,
        role: values.role
      })
      
      // Clear login form data after successful login
      localStorage.removeItem('loginFormData')
      
      // Show success toast message
      showToast('Login successful! Redirecting to dashboard...', 'success')
      
      // Redirect based on role after a short delay to allow user to see the success message
      setTimeout(() => {
        if (response.user.role === 'admin') {
          navigate('/admin/dashboard')
        } else if (response.user.role === 'customer') {
          navigate('/customer/dashboard')
        } else if (response.user.role === 'provider') {
          navigate('/provider/dashboard')
        }
      }, 1500) // 1.5 second delay to show success message
      
    } catch (error) {
      let responseData = {}
      let errorStatus =
        typeof error.status === 'number' ? error.status : null

      // Fetch helper (client.js) attaches JSON body and HTTP status
      if (error.data && typeof error.data === 'object') {
        responseData = { ...error.data }
      }

      const jsonMatch = error.message.match(/Server error:\s*({.*})/)
      if (jsonMatch) {
        try {
          responseData = { ...responseData, ...JSON.parse(jsonMatch[1]) }
        } catch {
          /* ignore */
        }
      }

      if (error.response) {
        errorStatus = error.response.status ?? errorStatus
        responseData = { ...responseData, ...(error.response.data || {}) }
      }

      const backendMessage = (
        responseData.message ||
        responseData.error ||
        responseData.detail ||
        ''
      ).toLowerCase()

      if (import.meta.env.DEV) {
        console.info('[login] API error shape (not the same as DB isApproved):', {
          httpStatus: errorStatus,
          apiMessage: responseData.message || error.message,
          /** True only when this failed response indicates account still pending approval */
          showPendingApprovalUi:
            backendMessage.includes('pending admin approval') ||
            backendMessage.includes('waiting for admin approval') ||
            backendMessage.includes('pending approval') ||
            backendMessage.includes('not approved') ||
            backendMessage.includes('awaiting approval') ||
            backendMessage.includes('account is pending') ||
            (backendMessage.includes('approval') &&
              backendMessage.includes('pending')) ||
            (errorStatus === 401 && responseData?.status === 'pending') ||
            (errorStatus === 403 &&
              responseData?.reason === 'pending_approval'),
          showSuspendedUi:
            backendMessage.includes('account suspended') ||
            backendMessage.includes('suspended') ||
            backendMessage.includes('blocked') ||
            (errorStatus === 403 &&
              responseData?.reason === 'suspended') ||
            responseData?.status === 'suspended',
        })
        console.info(
          '[login] Note: MongoDB field is `isApproved`. On a failed login you do not receive that flag — pending UI above is inferred only from the error.',
        )
      }

      const loginErrorLooksLikePendingApproval =
        backendMessage.includes('pending admin approval') ||
        backendMessage.includes('waiting for admin approval') ||
        backendMessage.includes('pending approval') ||
        backendMessage.includes('not approved') ||
        backendMessage.includes('awaiting approval') ||
        backendMessage.includes('account is pending') ||
        (backendMessage.includes('approval') &&
          backendMessage.includes('pending')) ||
        (errorStatus === 401 && responseData?.status === 'pending') ||
        (errorStatus === 403 && responseData?.reason === 'pending_approval')

      const loginErrorLooksLikeSuspended =
        backendMessage.includes('account suspended') ||
        backendMessage.includes('suspended') ||
        backendMessage.includes('blocked') ||
        (errorStatus === 403 && responseData?.reason === 'suspended') ||
        responseData?.status === 'suspended'

      if (loginErrorLooksLikePendingApproval) {
        showToast(
          'Your account is pending admin approval. Please wait for confirmation.',
          'warning',
        )
      } else if (loginErrorLooksLikeSuspended) {
        showToast(
          'Your account has been suspended. Contact admin for support.',
          'error',
        )
      } else {
        showToast(
          'Invalid email or password. Please check your credentials.',
          'error',
        )
      }
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
        className="relative w-full max-w-sm min-w-0"
      >
        <Card className="p-6 group hover:backdrop-blur-sm transition-all duration-300 overflow-hidden min-w-0">
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                messageType === 'success'
                  ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                  : 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-400'
              }`}
            >
              {messageType === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <Clock className="w-5 h-5 flex-shrink-0" />
              )}
              <p className="text-sm">{successMessage}</p>
              <button
                onClick={() => setSuccessMessage('')}
                className="ml-auto"
              >
                <XCircle className="w-4 h-4 hover:opacity-70" />
              </button>
            </motion.div>
          )}

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-custom-yellow to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User className="w-16 h-16 text-yellow-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold flex items-center justify-center text-custom-yellow mb-2">Welcome Back</h1>
          <p className="text-gray-400 flex items-center justify-center">Sign in to your account</p>

          <Formik
            initialValues={loadFormData()}
            validationSchema={loginValidationSchema}
            onSubmit={handleLogin}
            enableReinitialize={true}
          >
            {({ isSubmitting, errors, touched, values, setValues }) => {
              const handleFormChange = (e) => {
                handleFieldChange()
                const { name, value } = e.target
                setValues(prev => {
                  const newValues = { ...prev, [name]: value }
                  saveFormData(newValues)
                  return newValues
                })
              }

              return (
                <Form
                  className="space-y-6"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  onChange={handleFormChange}
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Login as
                    </label>
                    <Field
                      as="select"
                      name="role"
                      className="w-full max-w-sm px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-yellow focus:border-custom-yellow transition-all duration-200"
                    >
                      <option value="">Select your role</option>
                      <option value="customer">Customer</option>
                      <option value="provider">Service Provider</option>
                      <option value="admin">Admin</option>
                    </Field>
                    <ErrorMessage name="role" component="p" className="mt-2 text-sm text-red-400" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 ">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Field
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        className={`w-full max-w-sm px-4 py-3 pl-10 bg-gray-800/50 border ${errors.email && touched.email ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-yellow focus:border-custom-yellow transition-all duration-200`}
                      />
                    </div>
                    <ErrorMessage name="email" component="p" className="mt-2 text-sm text-red-400" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Field
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Enter your password"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        className={`w-full max-w-sm px-4 py-3 pl-10 pr-10 bg-gray-800/50 border ${errors.password && touched.password ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-yellow focus:border-custom-yellow transition-all duration-200`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-custom-yellow transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <ErrorMessage name="password" component="p" className="mt-2 text-sm text-red-400" />
                  </div>
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full py-3 bg-transparent text-yellow-400 border border-yellow-400/40 hover:bg-yellow-400 hover:text-slate-950 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                  </Button>

                </Form>
              )
            }}
          </Formik>
        </Card>
      </motion.div>
      {/* {toast.isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed top-4 right-4 z-40 max-w-sm"
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
      )} */}
{/* TOAST NOTIFICATION - Render via portal so it appears above header */}
{toast.isVisible && (
  <PortalToast>
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed top-20 left-0 right-0 z-[9999] flex justify-center px-4 pointer-events-none"
    >
      <div className={`pointer-events-auto px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 backdrop-blur-sm max-w-lg w-full ${
        toast.type === 'error'
          ? 'bg-red-500/95 border border-red-500/50 text-white'
          : toast.type === 'success'
            ? 'bg-green-500/95 border border-green-500/50 text-white'
            : 'bg-yellow-500/95 border border-yellow-500/50 text-white'
      }`}>
        {toast.type === 'error' ? (
          <XCircle className="w-5 h-5 flex-shrink-0" />
        ) : toast.type === 'success' ? (
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
        ) : (
          <Clock className="w-5 h-5 flex-shrink-0" />
        )}
        <p className="text-sm font-medium flex-1">{toast.message}</p>
        <button
          onClick={hideToast}
          className="text-white/80 hover:text-white transition-colors"
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

export default LoginPage
