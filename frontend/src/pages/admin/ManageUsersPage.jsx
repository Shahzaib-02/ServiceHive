import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, Edit, Ban, CheckCircle, XCircle, UserCheck, Trash2, Users, Search, Filter, User, Mail, Phone, MapPin, Calendar, Star, Briefcase, DollarSign } from 'lucide-react'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import { useAuth } from '../../hooks/useAuth'
import { apiRequest } from '../../services/api/client'

const ManageUsersPage = () => {
  const { token } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortOption, setSortOption] = useState('newest')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage] = useState(8)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await apiRequest({
        path: '/api/admin/users',
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      })

      const approvedUsers = response.approvedUsers || []
      const pendingUsers = response.pendingUsers || []
      
      // Combine all users (pending + approved) for display
      const allUsers = [
        ...pendingUsers.map(user => ({ 
          ...user, 
          status: 'pending',
          verified: false
        })),
        ...approvedUsers.map(user => ({ 
          ...user, 
          status: user.isSuspended === true ? 'suspended' : (user.isApproved === true ? 'active' : 'pending'), // Fix: Explicitly check for true, default to pending
          verified: user.isApproved === true
        }))
      ]

      // Transform users to match expected format
      const transformedUsers = allUsers.map(user => ({
        id: user._id || user.id,
        name: user.name || 'Unknown User',
        email: user.email || 'No email',
        phone: user.phone || 'No phone',
        role: user.role || 'customer',
        status: user.status || 'pending',
        avatar: user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'UN',
        joinedDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown',
        lastActive: 'Recently',
        // location: user.city || 'No location',
        // businessName: user.businessName || (user.role === 'provider' ? 'Business Name' : null),
        services: user.services || 0,
        totalBookings: user.totalBookings || 0,
        totalSpent: user.totalSpent || 0,
        totalEarnings: user.totalEarnings || 0,
        rating: user.rating || 0,
        verified: user.verified || false,
        cnic: user.cnic || 'No CNIC'
      }))
      
      setUsers(transformedUsers)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching users:', error)
      setLoading(false)
    }
  }

  const handleViewUser = (user) => {
    setSelectedUser(user)
    setShowViewModal(true)
  }

  const handleEditUser = (userId) => {
    console.log('Edit user:', userId)
    // TODO: Implement edit user functionality
    alert('Edit user functionality coming soon!')
  }

  const handleVerifyUser = async (userId) => {
    try {
      await apiRequest({
        path: `/api/admin/users/${userId}/approve`,
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      })
      
      // Reload users to update UI
      const response = await apiRequest({
        path: '/api/admin/users',
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      })

      const approvedUsers = response.approvedUsers || []
      const pendingUsers = response.pendingUsers || []
      
      // Combine all users (pending + approved) for display
      const allUsers = [
        ...pendingUsers.map(user => ({ 
          ...user, 
          status: 'pending',
          verified: false
        })),
        ...approvedUsers.map(user => ({ 
          ...user, 
          status: user.isSuspended === true ? 'suspended' : (user.isApproved === true ? 'active' : 'pending'), // Fix: Explicitly check for true, default to pending
          verified: user.isApproved === true
        }))
      ]

      // Transform users to match expected format
      const transformedUsers = allUsers.map(user => ({
        id: user._id || user.id,
        name: user.name || 'Unknown User',
        email: user.email || 'No email',
        phone: user.phone || 'No phone',
        role: user.role || 'customer',
        status: user.status || 'pending',
        avatar: user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'UN',
        joinedDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown',
        lastActive: 'Recently',
        // location: user.city || 'No location',
        // businessName: user.businessName || (user.role === 'provider' ? 'Business Name' : null),
        services: user.services || 0,
        // totalBookings: user.totalBookings || 0,
        totalSpent: user.totalSpent || 0,
        totalEarnings: user.totalEarnings || 0,
        rating: user.rating || 0,
        verified: user.verified || false,
        cnic: user.cnic || 'No CNIC'
      }))
      
      setUsers(transformedUsers)
      console.log('User verified:', userId)
    } catch (error) {
      console.error('Error verifying user:', error)
      alert('Error verifying user: ' + (error.message || 'Unknown error'))
    }
  }

  const handleRejectUser = async (userId) => {
    const reason = prompt('Please enter rejection reason:')
    if (!reason) return
    
    try {
      await apiRequest({
        path: `/api/admin/users/${userId}/reject`,
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        data: { rejectionReason: reason }
      })
      
      // Reload users to update UI
      const response = await apiRequest({
        path: '/api/admin/users',
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      })

      const approvedUsers = response.approvedUsers || []
      const pendingUsers = response.pendingUsers || []
      
      // Combine all users (pending + approved) for display
      const allUsers = [
        ...pendingUsers.map(user => ({ 
          ...user, 
          status: 'pending',
          verified: false
        })),
        ...approvedUsers.map(user => ({ 
          ...user, 
          status: user.isSuspended === true ? 'suspended' : (user.isApproved === true ? 'active' : 'pending'), // Fix: Explicitly check for true, default to pending
          verified: user.isApproved === true
        }))
      ]

      // Transform users to match expected format
      const transformedUsers = allUsers.map(user => ({
        id: user._id || user.id,
        name: user.name || 'Unknown User',
        email: user.email || 'No email',
        phone: user.phone || 'No phone',
        role: user.role || 'customer',
        status: user.status || 'pending',
        avatar: user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'UN',
        joinedDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown',
        lastActive: 'Recently',
        // location: user.city || 'No location',
        // businessName: user.businessName || (user.role === 'provider' ? 'Business Name' : null),
        services: user.services || 0,
        // totalBookings: user.totalBookings || 0,
        totalSpent: user.totalSpent || 0,
        totalEarnings: user.totalEarnings || 0,
        rating: user.rating || 0,
        verified: user.verified || false,
        cnic: user.cnic || 'No CNIC'
      }))
      
      setUsers(transformedUsers)
      console.log('User rejected:', userId)
    } catch (error) {
      console.error('Error rejecting user:', error)
      alert('Error rejecting user: ' + (error.message || 'Unknown error'))
    }
  }

  const handleSuspendUser = async (userId) => {
    try {
      await apiRequest({
        path: `/api/admin/users/${userId}/suspend`,
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      })
      
      // Reload users to update UI
      const response = await apiRequest({
        path: '/api/admin/users',
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      })

      const approvedUsers = response.approvedUsers || []
      const pendingUsers = response.pendingUsers || []
      
      // Combine all users (pending + approved) for display
      const allUsers = [
        ...pendingUsers.map(user => ({ 
          ...user, 
          status: 'pending',
          verified: false
        })),
        ...approvedUsers.map(user => ({ 
          ...user, 
          status: user.isSuspended === true ? 'suspended' : (user.isApproved === true ? 'active' : 'pending'), // Fix: Explicitly check for true, default to pending
          verified: user.isApproved === true
        }))
      ]

      // Transform users to match expected format
      const transformedUsers = allUsers.map(user => ({
        id: user._id || user.id,
        name: user.name || 'Unknown User',
        email: user.email || 'No email',
        phone: user.phone || 'No phone',
        role: user.role || 'customer',
        status: user.status || 'pending',
        avatar: user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'UN',
        joinedDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown',
        lastActive: 'Recently',
        // location: user.city || 'No location',
        // businessName: user.businessName || (user.role === 'provider' ? 'Business Name' : null),
        services: user.services || 0,
        // totalBookings: user.totalBookings || 0,
        totalSpent: user.totalSpent || 0,
        totalEarnings: user.totalEarnings || 0,
        rating: user.rating || 0,
        verified: user.verified || false,
        cnic: user.cnic || 'No CNIC'
      }))
      
      setUsers(transformedUsers)
      console.log('User suspended:', userId)
    } catch (error) {
      console.error('Error suspending user:', error)
      alert('Error suspending user: ' + (error.message || 'Unknown error'))
    }
  }

  const handleReactivateUser = async (userId) => {
    try {
      await apiRequest({
        path: `/api/admin/users/${userId}/unsuspend`,
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      })
      
      // Reload users to update UI
      const response = await apiRequest({
        path: '/api/admin/users',
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      })

      const approvedUsers = response.approvedUsers || []
      const pendingUsers = response.pendingUsers || []
      
      // Combine all users (pending + approved) for display
      const allUsers = [
        ...pendingUsers.map(user => ({ 
          ...user, 
          status: 'pending',
          verified: false
        })),
        ...approvedUsers.map(user => ({ 
          ...user, 
          status: user.isSuspended === true ? 'suspended' : (user.isApproved === true ? 'active' : 'pending'), // Fix: Explicitly check for true, default to pending
          verified: user.isApproved === true
        }))
      ]

      // Transform users to match expected format
      const transformedUsers = allUsers.map(user => ({
        id: user._id || user.id,
        name: user.name || 'Unknown User',
        email: user.email || 'No email',
        phone: user.phone || 'No phone',
        role: user.role || 'customer',
        status: user.status || 'pending',
        avatar: user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'UN',
        joinedDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown',
        lastActive: 'Recently',
        // location: user.city || 'No location',
        // businessName: user.businessName || (user.role === 'provider' ? 'Business Name' : null),
        services: user.services || 0,
        // totalBookings: user.totalBookings || 0,
        totalSpent: user.totalSpent || 0,
        totalEarnings: user.totalEarnings || 0,
        rating: user.rating || 0,
        verified: user.verified || false,
        cnic: user.cnic || 'No CNIC'
      }))
      
      setUsers(transformedUsers)
      console.log('User reactivated:', userId)
    } catch (error) {
      console.error('Error reactivating user:', error)
      alert('Error reactivating user: ' + (error.message || 'Unknown error'))
    }
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await apiRequest({
          path: `/api/admin/users/${userId}`,
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        })
        
        // Reload users to update UI
        const response = await apiRequest({
          path: '/api/admin/users',
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` }
        })

        const approvedUsers = response.approvedUsers || []
        const pendingUsers = response.pendingUsers || []
        
        // Combine all users (pending + approved) for display
        const allUsers = [
          ...pendingUsers.map(user => ({ 
            ...user, 
            status: 'pending',
            verified: false
          })),
          ...approvedUsers.map(user => ({ 
            ...user, 
            status: user.isSuspended === true ? 'suspended' : (user.isApproved === true ? 'active' : 'pending'), // Fix: Explicitly check for true, default to pending
            verified: user.isApproved === true
          }))
        ]

        // Transform users to match expected format
        const transformedUsers = allUsers.map(user => ({
          id: user._id || user.id,
          name: user.name || 'Unknown User',
          email: user.email || 'No email',
          phone: user.phone || 'No phone',
          role: user.role || 'customer',
          status: user.status || 'pending',
          avatar: user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'UN',
          joinedDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown',
          lastActive: 'Recently',
          // location: user.city || 'No location',
          // businessName: user.businessName || (user.role === 'provider' ? 'Business Name' : null),
          services: user.services || 0,
          // totalBookings: user.totalBookings || 0,
          totalSpent: user.totalSpent || 0,
          totalEarnings: user.totalEarnings || 0,
          rating: user.rating || 0,
          verified: user.verified || false,
          cnic: user.cnic || 'No CNIC'
        }))
        
        setUsers(transformedUsers)
        console.log('User deleted:', userId)
      } catch (error) {
        console.error('Error deleting user:', error)
        alert('Error deleting user: ' + (error.message || 'Unknown error'))
      }
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm)
    const matchesRole = filterRole === 'all' || user.role === filterRole
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortOption) {
      case 'newest':
        return new Date(b.joinedDate) - new Date(a.joinedDate)
      case 'oldest':
        return new Date(a.joinedDate) - new Date(b.joinedDate)
      case 'name':
        return a.name.localeCompare(b.name)
      case 'email':
        return a.email.localeCompare(b.email)
      default:
        return 0
    }
  })

  const totalPages = Math.ceil(sortedUsers.length / usersPerPage)
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  )

  const stats = [
    { label: 'Total Users', value: users.length, color: 'cyan' },
    { label: 'Active Users', value: users.filter(u => u.status === 'active').length, color: 'green' },
    { label: 'Pending Verification', value: users.filter(u => u.status === 'pending').length, color: 'yellow' },
    { label: 'Suspended Users', value: users.filter(u => u.status === 'suspended').length, color: 'red' }
  ]

  const UserCard = ({ user }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'active':
          return 'bg-green-500/20 text-green-400 border-green-500/50'
        case 'suspended':
          return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
        case 'pending':
          return 'bg-blue-500/20 text-blue-400 border-blue-500/50'
        case 'rejected':
          return 'bg-red-500/20 text-red-400 border-red-500/50'
        default:
          return 'bg-gray-500/20 text-gray-400 border-gray-500/50'
      }
    }

    const getRoleBadgeColor = (role) => {
      switch (role) {
        case 'admin':
          return 'bg-purple-500/20 text-purple-400'
        case 'provider':
          return 'bg-blue-500/20 text-blue-400'
        case 'customer':
          return 'bg-green-500/20 text-green-400'
        default:
          return 'bg-gray-500/20 text-gray-400'
      }
    }

    return (
      <Card className="p-6 hover:backdrop-blur-sm transition-all duration-300 border border-white/10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-custom-yellow to-orange-500 rounded-full flex items-center justify-center text-black font-bold">
              {user.avatar}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{user.name}</h3>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
            {user.status}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">{user.phone}</span>
          </div>
          {/* <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">{user.location}</span>
          </div> */}
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">{user.joinedDate}</span>
          </div>
          <div className={`flex items-center space-x-2`}>
            <Briefcase className="w-4 h-4 text-gray-400" />
            <span className={`text-sm font-medium px-2 py-1 rounded ${getRoleBadgeColor(user.role)}`}>
              {user.role}
            </span>
          </div>
        </div>

        {user.role === 'provider' && (
          <div className="grid grid-cols-3 gap-4 mb-4">
            {/* <div className="text-center">
              <div className="text-2xl font-bold text-custom-yellow">{user.services}</div>
              <div className="text-xs text-gray-400">Services</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-custom-yellow">{user.totalBookings}</div>
              <div className="text-xs text-gray-400">Bookings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-custom-yellow">{user.totalEarnings}</div>
              <div className="text-xs text-gray-400">Earnings</div>
            </div> */}
          </div>
        )}

        {user.role === 'customer' && (
          <div className="grid grid-cols-3 gap-4 mb-4">
            {/* <div className="text-center">
              <div className="text-2xl font-bold text-custom-yellow">{user.totalBookings}</div>
              <div className="text-xs text-gray-400">Bookings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-custom-yellow">{user.totalSpent}</div>
              <div className="text-xs text-gray-400">Spent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-custom-yellow">{user.rating}</div>
              <div className="text-xs text-gray-400">Rating</div>
            </div> */}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => handleViewUser(user)}>
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            {user.role === 'provider' && user.status === 'pending' && (
              <>
                <Button variant='outline' size="sm"  onClick={() => handleVerifyUser(user.id)}>
                  <UserCheck className="w-4 h-4 mr-1" />
                  Verify
                </Button>
                <Button variant="outline" size="sm"  onClick={() => handleRejectUser(user.id)}>
                  <XCircle className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              </>
            )}
            
            {user.role === 'customer' && user.status === 'pending' && (
              <>
                <Button variant='outline' size="sm"  onClick={() => handleVerifyUser(user.id)}>
                  <UserCheck className="w-4 h-4 mr-1" />
                  Approve
                </Button>
                <Button variant="outline" size="sm"  onClick={() => handleRejectUser(user.id)}>
                  <XCircle className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              </>
            )}
            
            {user.role !== 'admin' && user.status === 'active' && (
              <>
                <Button variant="outline" size="sm"  onClick={() => handleSuspendUser(user.id)}>
                  <Ban className="w-4 h-4 mr-1" />
                  Suspend
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleRejectUser(user.id)}>
                  <XCircle className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              </>
            )}
            
            {user.role !== 'admin' && user.status === 'suspended' && (
              <>
                <Button variant="outline" size="sm"  onClick={() => handleReactivateUser(user.id)}>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Reactivate
                </Button>
                <Button variant="outline" size="sm"  onClick={() => handleRejectUser(user.id)}>
                  <XCircle className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              </>
            )}
            
            {user.role !== 'admin' && user.status === 'rejected' && (
              <Button variant="outline" size="sm" onClick={() => handleVerifyUser(user.id)}>
                <CheckCircle className="w-4 h-4 mr-1" />
                Approve
              </Button>
            )}
            
            {user.role !== 'admin' && (
              <Button variant="outline" size="sm"  onClick={() => handleDeleteUser(user.id)}>
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading users...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Manage Users</h1>
          <div className="flex items-center space-x-4">
            <Input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
              startIcon={<Search className="w-4 h-4" />}
            />
            <Select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-40"
              options={[
                { value: 'all', label: 'All Roles' },
                { value: 'admin', label: 'Admin' },
                { value: 'provider', label: 'Provider' },
                { value: 'customer', label: 'Customer' }
              ]}
            />
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-40"
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'pending', label: 'Pending' },
                { value: 'suspended', label: 'Suspended' },
                { value: 'rejected', label: 'Rejected' }
              ]}
            />
            <Select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-40"
              options={[
                { value: 'newest', label: 'Newest' },
                { value: 'oldest', label: 'Oldest' },
                { value: 'name', label: 'Name' },
                { value: 'email', label: 'Email' }
              ]}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center">
              <div className={`text-3xl font-bold text-${stat.color}-400 mb-2`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">
                {stat.label}
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
          {paginatedUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-white px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* View User Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-gray-900 border border-white/20 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-white">User Details</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowViewModal(false)}
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                  <div className="text-white">{selectedUser.name}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                  <div className="text-white">{selectedUser.email}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                  <div className="text-white">{selectedUser.phone}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Role</label>
                  <div className={`text-sm font-medium px-3 py-1 rounded ${
                    selectedUser.role === 'admin' ? 'bg-purple-500/20 text-purple-400' :
                    selectedUser.role === 'provider' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {selectedUser.role}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                  <div className={`text-sm font-medium px-3 py-1 rounded ${
                    selectedUser.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/50' :
                    selectedUser.status === 'suspended' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' :
                    selectedUser.status === 'pending' ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' :
                    'bg-red-500/20 text-red-400 border-red-500/50'
                  }`}>
                    {selectedUser.status}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Joined Date</label>
                  <div className="text-white">{selectedUser.joinedDate}</div>
                </div>
                {/* <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                  <div className="text-white">{selectedUser.location}</div>
                </div> */}
                {selectedUser.role === 'provider' && (
                  <>
                    {/* <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Business Name</label>
                      <div className="text-white">{selectedUser.businessName}</div>
                    </div> */}
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">CNIC</label>
                      <div className="text-white">{selectedUser.cnic}</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default ManageUsersPage