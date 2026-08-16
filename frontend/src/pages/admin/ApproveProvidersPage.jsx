import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, Filter, CheckCircle, XCircle, AlertCircle, Eye,
  Star, MapPin, Calendar, Phone, Mail, FileText, Shield,
  Award, Clock, Users, TrendingUp, Download, MoreVertical
} from 'lucide-react'
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import { useAuth } from '../../hooks/useAuth'
import { apiRequest } from '../../services/api/client.js'

const ApproveProvidersPage = () => {
  const { token } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('pending')
  const [sortBy, setSortBy] = useState('applied')
  const [providers, setProviders] = useState([])
  const [pendingUsers, setPendingUsers] = useState([])
  const [approvedUsers, setApprovedUsers] = useState([])
  const [loading, setLoading] = useState(true)

  // Load all users from backend API
  useEffect(() => {
    const loadAllUsers = async () => {
      try {
        if (!token) {
          setLoading(false)
          return
        }

        // Fetch users data from backend
        const response = await apiRequest({
          path: '/api/admin/users',
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` }
        })

        const approved = response.approvedUsers || []
        const pending = response.pendingUsers || []
        
        // Combine all users (pending + approved) for display
        const allUsers = [
          ...pending.map(user => ({ ...user, status: 'pending' })),
          ...approved.map(user => ({ ...user, status: user.isApproved ? 'approved' : 'rejected' }))
        ]

        setProviders(allUsers)
        setPendingUsers(pending)
        setApprovedUsers(approved)
      } catch (error) {
        console.error('Error loading users:', error)
        setProviders([])
      } finally {
        setLoading(false)
      }
    }

    loadAllUsers()
  }, [token])

  const statusOptions = [
    { value: 'all', label: 'All Applications' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ]

  const sortOptions = [
    { value: 'applied', label: 'Application Date' },
    { value: 'name', label: 'Name' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' }
  ]

  // Approval functions
  const handleApprove = async (providerId) => {
    try {
      await apiRequest({
        path: `/api/admin/users/${providerId}/approve`,
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      })
      
      // Remove the approved user from pending users and add to approved
      const approvedUser = pendingUsers.find(user => user._id === providerId)
      if (approvedUser) {
        setPendingUsers(prev => prev.filter(user => user._id !== providerId))
        setApprovedUsers(prev => [...prev, { ...approvedUser, isApproved: true, isSuspended: false }])
        setProviders(prev => prev.map(provider => 
          provider._id === providerId 
            ? { ...provider, status: 'approved' }
            : provider
        ))
      }
    } catch (error) {
      console.error('Error approving provider:', error)
      alert('Error approving user: ' + (error.message || 'Unknown error'))
    }
  }

  const handleReject = async (providerId) => {
    const rejectionReason = prompt('Please provide a reason for rejection (optional):')
    
    try {
      await apiRequest({
        path: `/api/admin/users/${providerId}/reject`,
        method: 'PATCH',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: { rejectionReason: rejectionReason || 'Registration rejected by admin' }
      })
      
      // Remove the rejected user from pending users
      setPendingUsers(prev => prev.filter(user => user._id !== providerId))
      setProviders(prev => prev.map(provider => 
        provider._id === providerId 
          ? { ...provider, status: 'rejected' }
          : provider
      ))
    } catch (error) {
      console.error('Error rejecting provider:', error)
      alert('Error rejecting user: ' + (error.message || 'Unknown error'))
    }
  }

  
  
  const filteredProviders = (Array.isArray(providers) ? providers : []).filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.phone.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || provider.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getDocumentStatus = (status) => {
    switch (status) {
      case 'verified': return { icon: CheckCircle, color: 'text-green-400' }
      case 'pending': return { icon: Clock, color: 'text-yellow-400' }
      case 'rejected': return { icon: XCircle, color: 'text-red-400' }
      default: return { icon: AlertCircle, color: 'text-gray-400' }
    }
  }

  const ProviderCard = ({ provider }) => (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">{provider.name.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">{provider.name}</h3>
              <p className="text-gray-400 text-sm">{provider.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(provider.status)}`}>
                  {provider.status.charAt(0).toUpperCase() + provider.status.slice(1)}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  provider.role === 'customer' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-purple-500/20 text-purple-400'
                }`}>
                  {provider.role === 'customer' ? 'Customer' : 'Service Provider'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-400">Applied</p>
            <p className="text-white font-medium">{new Date(provider.createdAt || provider._doc?.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-gray-400">
            <Mail className="w-4 h-4" />
            <span className="text-sm">{provider.email}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <Phone className="w-4 h-4" />
            <span className="text-sm">{provider.phone}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <Shield className="w-4 h-4" />
            <span className="text-sm">CNIC: {provider.cnic || 'N/A'}</span>
          </div>
        </div>

        {/* CNIC Image Status */}
        {provider.cnicDocumentDataUrl && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-white mb-3">CNIC Document</h4>
            <div className="flex items-center space-x-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm">CNIC Document Uploaded</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end pt-4 border-t border-white/10">
          {provider.status === 'pending' && (
            <div className="flex items-center space-x-2">
              <Button variant="danger" size="sm" onClick={() => handleReject(provider._id)}>
                <XCircle className="w-4 h-4 mr-1" />
                Reject
              </Button>
              <Button variant="success" size="sm" onClick={() => handleApprove(provider._id)}>
                <CheckCircle className="w-4 h-4 mr-1" />
                Approve
              </Button>
            </div>
          )}
          
          {provider.status === 'approved' && (
            <div className="flex items-center text-green-400">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">Approved</span>
            </div>
          )}
          
          {provider.status === 'rejected' && (
            <div className="flex items-center text-red-400">
              <XCircle className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">Rejected</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )

  
  const stats = [
    { label: 'Pending Customers', value: (Array.isArray(pendingUsers) ? pendingUsers.filter(p => p.role === 'customer') : []).length, color: 'green' },
    { label: 'Pending Providers', value: (Array.isArray(pendingUsers) ? pendingUsers.filter(p => p.role === 'provider') : []).length, color: 'purple' },
    { label: 'Approved Users', value: (Array.isArray(approvedUsers) ? approvedUsers.filter(p => p.isApproved) : []).length, color: 'blue' },
    { label: 'Rejected Applications', value: (Array.isArray(approvedUsers) ? approvedUsers.filter(p => p.isSuspended && !p.isApproved) : []).length, color: 'red' }
  ]

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
          <h1 className="text-3xl font-bold text-white mb-2">User Approvals</h1>
          <p className="text-gray-400">
            Review and approve customer and service provider applications
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Shield className="w-4 h-4 mr-2" />
            Verification Guidelines
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass-card p-6 rounded-xl"
          >
            <div className="text-2xl font-bold gradient-text mb-1">{stat.value}</div>
            <div className="text-gray-400 text-sm">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12"
              />
            </div>
            
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusOptions}
            />
            
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={sortOptions}
            />
            
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Alert for Pending Applications */}
      {pendingUsers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="border-2 border-yellow-500/30 bg-yellow-500/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-6 h-6 text-yellow-400" />
                <div>
                  <p className="text-white font-medium">
                    {pendingUsers.length} applications pending review
                  </p>
                  <p className="text-gray-400 text-sm">
                    Average response time: 48 hours
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Trends
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Providers List */}
      <div className="space-y-4">
        {filteredProviders.length > 0 ? (
          filteredProviders.map((provider, index) => (
            <motion.div
              key={provider._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProviderCard provider={provider} />
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No user applications found
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'No new applications at the moment'
              }
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ApproveProvidersPage
