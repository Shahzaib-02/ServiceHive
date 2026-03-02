import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, Filter, Edit, Trash2, Eye, Plus, Star, MapPin,
  DollarSign, Calendar, TrendingUp, TrendingDown, MoreVertical,
  ToggleLeft, ToggleRight, Clock, Users
} from 'lucide-react'
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";

const ManageServicesPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('created')

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'draft', label: 'Draft' }
  ]

  const sortOptions = [
    { value: 'created', label: 'Date Created' },
    { value: 'name', label: 'Service Name' },
    { value: 'price', label: 'Price' },
    { value: 'popularity', label: 'Popularity' }
  ]

  const services = [
    {
      id: 1,
      title: 'Professional Home Cleaning',
      category: 'Home Services',
      price: 75,
      duration: '2-3 hours',
      status: 'active',
      views: 1240,
      bookings: 89,
      rating: 4.8,
      reviews: 45,
      revenue: 6675,
      created: '2024-01-15',
      image: 'cleaning',
      description: 'Professional deep cleaning for your home'
    },
    {
      id: 2,
      title: 'Deep Carpet Cleaning',
      category: 'Home Services',
      price: 120,
      duration: '3-4 hours',
      status: 'active',
      views: 890,
      bookings: 34,
      rating: 4.9,
      reviews: 28,
      revenue: 4080,
      created: '2024-01-10',
      image: 'carpet',
      description: 'Deep cleaning for carpets and rugs'
    },
    {
      id: 3,
      title: 'Office Cleaning Service',
      category: 'Business Services',
      price: 200,
      duration: '4-5 hours',
      status: 'inactive',
      views: 567,
      bookings: 12,
      rating: 4.7,
      reviews: 8,
      revenue: 2400,
      created: '2023-12-20',
      image: 'office',
      description: 'Professional cleaning for office spaces'
    },
    {
      id: 4,
      title: 'Window Cleaning',
      category: 'Home Services',
      price: 80,
      duration: '2 hours',
      status: 'draft',
      views: 234,
      bookings: 0,
      rating: 0,
      reviews: 0,
      revenue: 0,
      created: '2024-01-18',
      image: 'window',
      description: 'Professional window cleaning service'
    }
  ]

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || service.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'inactive': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'draft': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <ToggleRight className="w-4 h-4" />
      case 'inactive': return <ToggleLeft className="w-4 h-4" />
      case 'draft': return <Clock className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const ServiceCard = ({ service }) => (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">{service.title[0]}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">{service.title}</h3>
              <p className="text-gray-400 text-sm">{service.category}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(service.status)}`}>
                  {getStatusIcon(service.status)}
                  <span>{service.status.charAt(0).toUpperCase() + service.status.slice(1)}</span>
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
          {service.description}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-gray-400 text-xs">Price</p>
            <p className="text-white font-semibold">${service.price}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Duration</p>
            <p className="text-white font-semibold">{service.duration}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Bookings</p>
            <p className="text-white font-semibold">{service.bookings}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Revenue</p>
            <p className="text-white font-semibold">${service.revenue}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">{service.views}</span>
            </div>
            {service.rating > 0 && (
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm text-gray-400">{service.rating}</span>
                <span className="text-sm text-gray-500">({service.reviews})</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
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
    { label: 'Total Services', value: services.length, icon: Star, color: 'cyan' },
    { label: 'Active Services', value: services.filter(s => s.status === 'active').length, icon: ToggleRight, color: 'green' },
    { label: 'Total Bookings', value: services.reduce((sum, s) => sum + s.bookings, 0), icon: Calendar, color: 'purple' },
    { label: 'Total Revenue', value: `$${services.reduce((sum, s) => sum + s.revenue, 0)}`, icon: DollarSign, color: 'yellow' }
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
          <h1 className="text-3xl font-bold text-white mb-2">Manage Services</h1>
          <p className="text-gray-400">
            Create, edit, and manage your service offerings
          </p>
        </div>
        
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add New Service
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
            className="glass-card p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-600 rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center space-x-1 text-sm ${
                stat.label.includes('Revenue') || stat.label.includes('Bookings') ? 'text-green-500' : 'text-gray-500'
              }`}>
                {stat.label.includes('Revenue') || stat.label.includes('Bookings') ? (
                  <TrendingUp className="w-4 h-4" />
                ) : null}
              </div>
            </div>
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
                placeholder="Search services..."
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

      {/* Services List */}
      <div className="space-y-4">
        {filteredServices.length > 0 ? (
          filteredServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ServiceCard service={service} />
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
              <Star className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No services found
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'You haven\'t created any services yet'
              }
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Service
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ManageServicesPage
