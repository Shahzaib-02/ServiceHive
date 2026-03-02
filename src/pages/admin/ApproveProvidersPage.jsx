import React, { useState } from 'react'
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

const ApproveProvidersPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('pending')
  const [sortBy, setSortBy] = useState('applied')

  const statusOptions = [
    { value: 'all', label: 'All Applications' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'verified', label: 'Verified' }
  ]

  const sortOptions = [
    { value: 'applied', label: 'Application Date' },
    { value: 'name', label: 'Business Name' },
    { value: 'service', label: 'Service Type' },
    { value: 'rating', label: 'Rating' }
  ]

  const providers = [
    {
      id: 1,
      businessName: 'CleanPro Solutions',
      ownerName: 'John Doe',
      email: 'john@cleanpro.com',
      phone: '+1 234-567-8900',
      service: 'Home Cleaning',
      location: 'New York, NY',
      appliedDate: '2024-01-18',
      status: 'pending',
      documents: {
        businessLicense: 'verified',
        insurance: 'verified',
        backgroundCheck: 'pending',
        certifications: 'verified'
      },
      description: 'Professional cleaning services with 5+ years of experience',
      services: ['Home Cleaning', 'Deep Cleaning', 'Office Cleaning'],
      teamSize: '5-10',
      yearsInBusiness: 5,
      previousWork: 12,
      rating: 0,
      avatar: 'CP'
    },
    {
      id: 2,
      businessName: 'TechMasters Inc',
      ownerName: 'Sarah Johnson',
      email: 'sarah@techmasters.com',
      phone: '+1 234-567-8901',
      service: 'Web Development',
      location: 'San Francisco, CA',
      appliedDate: '2024-01-17',
      status: 'pending',
      documents: {
        businessLicense: 'pending',
        insurance: 'verified',
        backgroundCheck: 'pending',
        certifications: 'verified'
      },
      description: 'Full-stack web development and digital solutions',
      services: ['Web Development', 'Mobile Apps', 'UI/UX Design'],
      teamSize: '10-20',
      yearsInBusiness: 3,
      previousWork: 8,
      rating: 0,
      avatar: 'TM'
    },
    {
      id: 3,
      businessName: 'AutoSpa Premium',
      ownerName: 'Mike Chen',
      email: 'mike@autospa.com',
      phone: '+1 234-567-8902',
      service: 'Car Detailing',
      location: 'Los Angeles, CA',
      appliedDate: '2024-01-16',
      status: 'approved',
      documents: {
        businessLicense: 'verified',
        insurance: 'verified',
        backgroundCheck: 'verified',
        certifications: 'verified'
      },
      description: 'Premium car detailing and automotive care services',
      services: ['Car Detailing', 'Paint Protection', 'Interior Cleaning'],
      teamSize: '2-5',
      yearsInBusiness: 7,
      previousWork: 45,
      rating: 4.9,
      avatar: 'AP'
    },
    {
      id: 4,
      businessName: 'EduExperts',
      ownerName: 'Emily Davis',
      email: 'emily@eduexperts.com',
      phone: '+1 234-567-8903',
      service: 'Tutoring',
      location: 'Boston, MA',
      appliedDate: '2024-01-15',
      status: 'rejected',
      documents: {
        businessLicense: 'verified',
        insurance: 'pending',
        backgroundCheck: 'verified',
        certifications: 'pending'
      },
      description: 'Professional tutoring and educational services',
      services: ['Math Tutoring', 'Science Tutoring', 'Test Prep'],
      teamSize: '5-10',
      yearsInBusiness: 2,
      previousWork: 6,
      rating: 0,
      avatar: 'EE',
      rejectionReason: 'Insufficient insurance documentation'
    }
  ]

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.service.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || provider.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'verified': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
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
              <span className="text-white font-bold text-xl">{provider.avatar}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">{provider.businessName}</h3>
              <p className="text-gray-400 text-sm">{provider.ownerName}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(provider.status)}`}>
                  {provider.status.charAt(0).toUpperCase() + provider.status.slice(1)}
                </span>
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                  {provider.service}
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-400">Applied</p>
            <p className="text-white font-medium">{provider.appliedDate}</p>
          </div>
        </div>

        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
          {provider.description}
        </p>

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
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{provider.location}</span>
          </div>
        </div>

        {/* Documents Status */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-white mb-3">Documents Verification</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(provider.documents).map(([doc, status]) => {
              const { icon: Icon, color } = getDocumentStatus(status)
              return (
                <div key={doc} className="text-center">
                  <Icon className={`w-5 h-5 mx-auto mb-1 ${color}`} />
                  <p className="text-xs text-gray-400 capitalize">{doc.replace(/([A-Z])/g, ' $1').trim()}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Business Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
          <div>
            <p className="text-gray-400">Team Size</p>
            <p className="text-white font-medium">{provider.teamSize}</p>
          </div>
          <div>
            <p className="text-gray-400">Years in Business</p>
            <p className="text-white font-medium">{provider.yearsInBusiness}</p>
          </div>
          <div>
            <p className="text-gray-400">Previous Work</p>
            <p className="text-white font-medium">{provider.previousWork} jobs</p>
          </div>
          <div>
            <p className="text-gray-400">Services</p>
            <p className="text-white font-medium">{provider.services.length}</p>
          </div>
        </div>

        {/* Rejection Reason */}
        {provider.status === 'rejected' && provider.rejectionReason && (
          <div className="glass-card p-3 rounded-lg mb-4 border border-red-500/30">
            <p className="text-red-400 text-sm font-medium mb-1">Rejection Reason:</p>
            <p className="text-gray-300 text-sm">{provider.rejectionReason}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-1" />
              View Details
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-1" />
              Documents
            </Button>
          </div>
          
          {provider.status === 'pending' && (
            <div className="flex items-center space-x-2">
              <Button size="sm" className="bg-red-500 hover:bg-red-600">
                <XCircle className="w-4 h-4 mr-1" />
                Reject
              </Button>
              <Button size="sm">
                <CheckCircle className="w-4 h-4 mr-1" />
                Approve
              </Button>
            </div>
          )}
          
          {provider.status === 'approved' && (
            <Button size="sm">
              <Shield className="w-4 h-4 mr-1" />
              Verify
            </Button>
          )}
        </div>
      </div>
    </Card>
  )

  const stats = [
    { label: 'Pending Applications', value: providers.filter(p => p.status === 'pending').length, color: 'yellow' },
    { label: 'Approved Today', value: providers.filter(p => p.status === 'approved').length, color: 'green' },
    { label: 'Verified Providers', value: providers.filter(p => p.status === 'verified').length, color: 'cyan' },
    { label: 'Rejected Applications', value: providers.filter(p => p.status === 'rejected').length, color: 'red' }
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
          <h1 className="text-3xl font-bold text-white mb-2">Approve Providers</h1>
          <p className="text-gray-400">
            Review and approve service provider applications
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
      {providers.filter(p => p.status === 'pending').length > 0 && (
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
                    {providers.filter(p => p.status === 'pending').length} applications pending review
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
              key={provider.id}
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
              No provider applications found
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
