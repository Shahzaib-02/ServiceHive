import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, Filter, Edit, Trash2, Eye, MoreVertical, Star,
  MapPin, Calendar, DollarSign, Users, TrendingUp,
  TrendingDown, AlertCircle, CheckCircle, XCircle,
  BarChart3, PieChart, Activity
} from 'lucide-react'
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";

const AdminManageServicesPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('created')

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'home', label: 'Home Services' },
    { value: 'beauty', label: 'Beauty & Wellness' },
    { value: 'tech', label: 'Tech Support' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'education', label: 'Education' },
    { value: 'business', label: 'Business Services' }
  ]

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'flagged', label: 'Flagged for Review' }
  ]

  const sortOptions = [
    { value: 'created', label: 'Date Created' },
    { value: 'name', label: 'Service Name' },
    { value: 'provider', label: 'Provider' },
    { value: 'popularity', label: 'Popularity' },
    { value: 'revenue', label: 'Revenue' }
  ]

  const services = [
    {
      id: 1,
      name: 'Professional Home Cleaning',
      provider: 'CleanPro Solutions',
      providerId: 1,
      category: 'home',
      price: 75,
      duration: '2-3 hours',
      location: 'New York, NY',
      status: 'active',
      createdDate: '2024-01-15',
      views: 1240,
      bookings: 89,
      revenue: 6675,
      rating: 4.8,
      reviews: 45,
      flags: 0,
      lastUpdated: '2024-01-18'
    },
    {
      id: 2,
      name: 'Deep Carpet Cleaning',
      provider: 'CleanPro Solutions',
      providerId: 1,
      category: 'home',
      price: 120,
      duration: '3-4 hours',
      location: 'New York, NY',
      status: 'active',
      createdDate: '2024-01-10',
      views: 890,
      bookings: 34,
      revenue: 4080,
      rating: 4.9,
      reviews: 28,
      flags: 0,
      lastUpdated: '2024-01-16'
    },
    {
      id: 3,
      name: 'Web Development',
      provider: 'TechMasters Inc',
      providerId: 2,
      category: 'tech',
      price: 500,
      duration: 'Custom',
      location: 'San Francisco, CA',
      status: 'active',
      createdDate: '2024-01-08',
      views: 2100,
      bookings: 12,
      revenue: 6000,
      rating: 4.7,
      reviews: 8,
      flags: 0,
      lastUpdated: '2024-01-17'
    },
    {
      id: 4,
      name: 'Premium Car Detailing',
      provider: 'AutoSpa Premium',
      providerId: 3,
      category: 'automotive',
      price: 150,
      duration: '2-3 hours',
      location: 'Los Angeles, CA',
      status: 'flagged',
      createdDate: '2024-01-12',
      views: 567,
      bookings: 8,
      revenue: 1200,
      rating: 4.6,
      reviews: 5,
      flags: 3,
      lastUpdated: '2024-01-19',
      flagReason: 'Customer complaints about quality'
    },
    {
      id: 5,
      name: 'Math Tutoring',
      provider: 'EduExperts',
      providerId: 4,
      category: 'education',
      price: 45,
      duration: '1 hour',
      location: 'Boston, MA',
      status: 'inactive',
      createdDate: '2023-12-20',
      views: 234,
      bookings: 0,
      revenue: 0,
      rating: 0,
      reviews: 0,
      flags: 0,
      lastUpdated: '2024-01-05'
    }
  ]

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || service.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'inactive': return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      case 'suspended': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'flagged': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'home': return 'text-cyan-400 bg-cyan-500/20'
      case 'beauty': return 'text-pink-400 bg-pink-500/20'
      case 'tech': return 'text-purple-400 bg-purple-500/20'
      case 'automotive': return 'text-blue-400 bg-blue-500/20'
      case 'education': return 'text-green-400 bg-green-500/20'
      case 'business': return 'text-yellow-400 bg-yellow-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  const ServiceCard = ({ service }) => (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">{service.name[0]}</span>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">{service.name}</h3>
              <p className="text-gray-400 text-sm">{service.provider}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(service.category)}`}>
                  {service.category}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(service.status)}`}>
                  {service.status}
                </span>
                {service.flags > 0 && (
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">
                    {service.flags} flags
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold gradient-text">${service.price}</div>
            <div className="text-sm text-gray-400">{service.duration}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-gray-400 text-xs">Views</p>
            <p className="text-white font-semibold">{service.views}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Bookings</p>
            <p className="text-white font-semibold">{service.bookings}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Revenue</p>
            <p className="text-white font-semibold">${service.revenue}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Rating</p>
            <div className="flex items-center space-x-1">
              {service.rating > 0 ? (
                <>
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-white font-semibold">{service.rating}</span>
                </>
              ) : (
                <span className="text-gray-500">No rating</span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center space-x-2 text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>{service.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>Created {service.createdDate}</span>
          </div>
        </div>

        {/* Flag Reason */}
        {service.status === 'flagged' && service.flagReason && (
          <div className="glass-card p-3 rounded-lg mb-4 border border-yellow-500/30">
            <p className="text-yellow-400 text-sm font-medium mb-1">Flag Reason:</p>
            <p className="text-gray-300 text-sm">{service.flagReason}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-1" />
              View Details
            </Button>
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-1" />
              Analytics
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            {service.status === 'flagged' && (
              <>
                <Button variant="outline" size="sm" className="text-green-400 hover:text-green-300">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Resolve
                </Button>
                <Button variant="outline" size="sm" className="text-red-400 hover:text-red-300">
                  <XCircle className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              </>
            )}
            
            {service.status === 'active' && (
              <Button variant="outline" size="sm" className="text-yellow-400 hover:text-yellow-300">
                <AlertCircle className="w-4 h-4 mr-1" />
                Flag
              </Button>
            )}
            
            {service.status === 'inactive' && (
              <Button size="sm">
                <CheckCircle className="w-4 h-4 mr-1" />
                Activate
              </Button>
            )}
            
            <Button variant="outline" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )

  const stats = [
    { label: 'Total Services', value: services.length, color: 'cyan' },
    { label: 'Active Services', value: services.filter(s => s.status === 'active').length, color: 'green' },
    { label: 'Flagged Services', value: services.filter(s => s.status === 'flagged').length, color: 'yellow' },
    { label: 'Total Revenue', value: `$${services.reduce((sum, s) => sum + s.revenue, 0)}`, color: 'purple' }
  ]

  const categoryStats = [
    { name: 'Home Services', count: 2, revenue: 10755 },
    { name: 'Tech Support', count: 1, revenue: 6000 },
    { name: 'Automotive', count: 1, revenue: 1200 },
    { name: 'Education', count: 1, revenue: 0 }
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
            Monitor and manage all platform services
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Activity className="w-4 h-4 mr-2" />
            Service Health
          </Button>
          <Button>
            <BarChart3 className="w-4 h-4 mr-2" />
            Generate Report
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Services List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Filters */}
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
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                options={categoryOptions}
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
            </div>
          </Card>

          {/* Flagged Services Alert */}
          {services.filter(s => s.status === 'flagged').length > 0 && (
            <Card className="border-2 border-yellow-500/30 bg-yellow-500/5">
              <div className="p-4">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-6 h-6 text-yellow-400" />
                  <div>
                    <p className="text-white font-medium">
                      {services.filter(s => s.status === 'flagged').length} services flagged for review
                    </p>
                    <p className="text-gray-400 text-sm">
                      Immediate attention required
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}

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
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No services found
                </h3>
                <p className="text-gray-400">
                  {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : 'No services available'
                  }
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Category Breakdown</h3>
            
            <div className="space-y-4">
              {categoryStats.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{category.name}</span>
                    <span className="text-gray-400 text-sm">{category.count} services</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full"
                        style={{ width: `${(category.revenue / 17955) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-400 w-16 text-right">
                      ${category.revenue}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">Total Revenue</p>
                <p className="text-2xl font-bold gradient-text">$17,955</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminManageServicesPage
