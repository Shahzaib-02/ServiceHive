import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'customer'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleLogin = (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate login API call
    setTimeout(() => {
      // Mock authentication with credentials validation
      const adminEmail = 'admin@servicehive.com'
      const adminPassword = 'admin123'
      
      let isAuthenticated = false
      let userData = null
      
      // Check admin credentials
      if (formData.email === adminEmail && formData.password === adminPassword) {
        isAuthenticated = true
        userData = {
          email: adminEmail,
          role: 'admin',
          name: 'Admin User',
          id: 'admin_001'
        }
      }
      // Check customer credentials (mock)
      else if (formData.role === 'customer' && formData.email && formData.password) {
        isAuthenticated = true
        userData = {
          email: formData.email,
          role: 'customer',
          name: 'John Doe',
          id: 'customer_001'
        }
      }
      // Check provider credentials (mock)
      else if (formData.role === 'provider' && formData.email && formData.password) {
        isAuthenticated = true
        userData = {
          email: formData.email,
          role: 'provider',
          name: 'Jane Smith',
          id: 'provider_001'
        }
      }
      
      if (isAuthenticated && userData) {
        // Store user info in localStorage
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('isLoggedIn', 'true')
        
        // Redirect based on role
        if (userData.role === 'customer') {
          navigate('/customer/dashboard')
        } else if (userData.role === 'provider') {
          navigate('/provider/dashboard')
        } else if (userData.role === 'admin') {
          navigate('/admin/dashboard')
        }
      } else {
        // Show error message
        alert('Invalid credentials. Please check your email and password.')
      }
      
      setIsLoading(false)
    }, 1000)
  }

  const roleOptions = [
    { value: 'customer', label: 'Customer' },
    { value: 'provider', label: 'Service Provider' },
    { value: 'admin', label: 'Admin' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0">
        <img 
          src="https://picsum.photos/seed/login/1920/1080.jpg"
          alt="Login Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80"></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <Card className="p-8 group hover:backdrop-blur-sm transition-all duration-300">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h1>
            <p className="text-gray-400">Sign in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <Select
              label="Login as"
              name="role"
              value={formData.role}
              onChange={handleChange}
              options={roleOptions}
              required
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              icon={Mail}
              required
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-12 pr-12 glass-card border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                  required
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 bg-white/10 border-white/20 rounded text-cyan-500 focus:ring-cyan-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-300">Remember me</span>
              </label>
              <a href="#" className="text-sm text-cyan-500 hover:text-cyan-400 transition-colors">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-gray-400 text-sm mb-4">
              Don't have an account?{' '}
              <Link to="/register" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                Sign up
              </Link>
            </p>
            
            {/* Admin Credentials Display */}
            <div className="glass-card p-4 rounded-lg mb-4 border border-cyan-500/30">
              <p className="text-cyan-400 text-xs font-medium mb-2">Admin Login Credentials:</p>
              <p className="text-gray-300 text-xs">Email: admin@servicehive.com</p>
              <p className="text-gray-300 text-xs">Password: admin123</p>
            </div>
            
            <p className="text-gray-500 text-xs">
              By logging in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-dark text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full">
                <span className="sr-only">Sign in with Google</span>
                <div className="flex items-center justify-center space-x-2">
                  <span>G</span>
                  <span>Google</span>
                </div>
              </Button>
              <Button variant="outline" className="w-full">
                <span className="sr-only">Sign in with Facebook</span>
                <div className="flex items-center justify-center space-x-2">
                  <span>f</span>
                  <span>Facebook</span>
                </div>
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default LoginPage
