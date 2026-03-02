import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, Filter, Users, Calendar, Mail, Phone, MapPin,
  Star, MoreVertical, Eye, Edit, Trash2, Shield, Ban,
  CheckCircle, XCircle, AlertCircle, UserCheck, Crown
} from 'lucide-react'
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";

const ManageUsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('joined')

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'customer', label: 'Customers' },
    { value: 'provider', label: 'Providers' },
    { value: 'admin', label: 'Admins' }
  ]

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'banned', label: 'Banned' },
    { value: 'pending', label: 'Pending Verification' }
  ]

  const sortOptions = [
    { value: 'joined', label: 'Join Date' },
    { value: 'name', label: 'Name' },
    { value: 'email', label: 'Email' },
    { value: 'last_active', label: 'Last Active' }
  ]

  const users = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 234-567-8901',
      role: 'customer',
      status: 'active',
      avatar: 'SJ',
      joinedDate: '2024-01-15',
      lastActive: '2 hours ago',
      location: 'New York, NY',
      totalBookings: 24,
      totalSpent: 1847,
      rating: 4.8,
      verified: true
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      phone: '+1 234-567-8902',
      role: 'provider',
      status: 'active',
      avatar: 'MC',
      joinedDate: '2023-12-10',
      lastActive: '30 minutes ago',
      location: 'Los Angeles, CA',
      businessName: 'TechMasters',
      services: 5,
      totalBookings: 89,
      totalEarnings: 12450,
      rating: 4.9,
      verified: true
    },
    {
      id: 3,
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '+1 234-567-8903',
      role: 'customer',
      status: 'active',
      avatar: 'ED',
      joinedDate: '2024-01-08',
      lastActive: '1 day ago',
      location: 'Chicago, IL',
      totalBookings: 12,
      totalSpent: 920,
      rating: 4.7,
      verified: true
    },
    {
      id: 4,
      name: 'Robert Wilson',
      email: 'robert.wilson@email.com',
      phone: '+1 234-567-8904',
      role: 'provider',
      status: 'suspended',
      avatar: 'RW',
      joinedDate: '2023-11-20',
      lastActive: '3 days ago',
      location: 'Houston, TX',
      businessName: 'CleanPro Solutions',
      services: 3,
      totalBookings: 45,
      totalEarnings: 5670,
      rating: 4.5,
      verified: false
    },
    {
      id: 5,
      name: 'John Admin',
      email: 'john.admin@servicehive.com',
      phone: '+1 234-567-8905',
      role: 'admin',
      status: 'active',
      avatar: 'JA',
      joinedDate: '2023-01-01',
      lastActive: '5 minutes ago',
      location: 'San Francisco, CA',
      permissions: 'full',
      verified: true
    }
  ]

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.businessName && user.businessName.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'suspended': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'banned': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'pending': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'customer': return <Users className="w-4 h-4" />
      case 'provider': return <Star className="w-4 h-4" />
      case 'admin': return <Crown className="w-4 h-4" />
      default: return <Users className="w-4 h-4" />
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'customer': return 'text-cyan-400 bg-cyan-500/20'
      case 'provider': return 'text-purple-400 bg-purple-500/20'
      case 'admin': return 'text-yellow-400 bg-yellow-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  const UserCard = ({ user }) => (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">{user.avatar}</span>
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h3 className="font-semibold text-white">{user.name}</h3>
                {user.verified && (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                )}
              </div>
              <p className="text-gray-400 text-sm">{user.email}</p>
              {user.businessName && (
                <p className="text-gray-500 text-xs">{user.businessName}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getRoleColor(user.role)}`}>
              {getRoleIcon(user.role)}
              <span>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-gray-400">
            <Phone className="w-4 h-4" />
            <span className="text-sm">{user.phone}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{user.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Joined {user.joinedDate}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <Users className="w-4 h-4" />
            <span className="text-sm">Active {user.lastActive}</span>
          </div>
        </div>

        {/* Role-specific stats */}
        {user.role === 'customer' && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-gray-400 text-xs">Total Bookings</p>
              <p className="text-white font-semibold">{user.totalBookings}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Total Spent</p>
              <p className="text-white font-semibold">${user.totalSpent}</p>
            </div>
          </div>
        )}

        {user.role === 'provider' && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-gray-400 text-xs">Services</p>
              <p className="text-white font-semibold">{user.services}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Total Bookings</p>
              <p className="text-white font-semibold">{user.totalBookings}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Earnings</p>
              <p className="text-white font-semibold">${user.totalEarnings}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Rating</p>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-white font-semibold">{user.rating}</span>
              </div>
            </div>
          </div>
        )}

        {user.role === 'admin' && (
          <div className="mb-4">
            <p className="text-gray-400 text-xs mb-2">Permissions</p>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
              {user.permissions}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            {user.role === 'provider' && user.status === 'pending' && (
              <Button size="sm" className="bg-green-500 hover:bg-green-600">
                <UserCheck className="w-4 h-4 mr-1" />
                Verify
              </Button>
            )}
            
            {user.status === 'active' && (
              <Button variant="outline" size="sm" className="text-yellow-400 hover:text-yellow-300">
                <Ban className="w-4 h-4 mr-1" />
                Suspend
              </Button>
            )}
            
            {user.status === 'suspended' && (
              <Button variant="outline" size="sm" className="text-green-400 hover:text-green-300">
                <CheckCircle className="w-4 h-4 mr-1" />
                Reactivate
              </Button>
            )}
            
            <Button variant="outline" size="sm" className="text-red-400 hover:text-red-300">
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )

  const stats = [
    { label: 'Total Users', value: users.length, color: 'cyan' },
    { label: 'Active Users', value: users.filter(u => u.status === 'active').length, color: 'green' },
    { label: 'Pending Verification', value: users.filter(u => u.status === 'pending').length, color: 'yellow' },
    { label: 'Suspended Users', value: users.filter(u => u.status === 'suspended').length, color: 'red' }
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
          <h1 className="text-3xl font-bold text-white mb-2">Manage Users</h1>
          <p className="text-gray-400">
            View and manage all platform users
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Shield className="w-4 h-4 mr-2" />
            Security Logs
          </Button>
          <Button>
            <Users className="w-4 h-4 mr-2" />
            Export Users
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12"
              />
            </div>
            
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              options={roleOptions}
            />
            
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

      {/* Alerts */}
      {users.filter(u => u.status === 'pending').length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="border-2 border-yellow-500/30 bg-yellow-500/5">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-yellow-400" />
              <div>
                <p className="text-white font-medium">
                  {users.filter(u => u.status === 'pending').length} users pending verification
                </p>
                <p className="text-gray-400 text-sm">
                  Review and approve provider applications
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <UserCard user={user} />
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
              No users found
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'No users registered yet'
              }
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ManageUsersPage
