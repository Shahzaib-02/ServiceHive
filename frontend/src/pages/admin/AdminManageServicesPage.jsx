import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Eye,
  MoreVertical,
  CheckCircle,
  XCircle,
  MapPin,
  Calendar,
  Star,
  DollarSign,
  Users,
  X
} from 'lucide-react'

import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'

import {
  approveServiceRequest,
  rejectServiceRequest
} from '../../services/api/servicesApi'
import { deleteAdminServiceRequest } from '../../services/api/adminApi'
import { formatMoney } from '../../utils/format'

import { useAuth } from '../../hooks/useAuth'
import { useServices } from '../../hooks/useServices'

const AdminManageServicesPage = () => {
  const { user, token } = useAuth()
  const { services, isLoading, fetchServices } = useServices()

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Toast state
  const [toast, setToast] = useState({ 
    message: '', 
    type: 'warning', 
    isVisible: false 
  })

  // Local state for viewing service details and deletion
  const [viewService, setViewService] = useState(null)
  const [showAllImages, setShowAllImages] = useState(false)
  const [busy, setBusy] = useState('')
  const [err, setErr] = useState('')

  const showToast = (message, type = 'warning') => {
    setToast({ message, type, isVisible: true })
    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }))
    }, 4000)
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const openView = (svc) => {
    setViewService(svc)
    setShowAllImages(false)
    setErr('')
  }

  const handleDeleteService = async (svc) => {
    if (!window.confirm(`Delete listing "${svc.title}"?`)) return
    setBusy(svc.id)
    try {
      const authHeaders = { Authorization: `Bearer ${token}` }
      await deleteAdminServiceRequest(svc.id, authHeaders)
      await fetchServices()
      setToast({ message: 'Service deleted', type: 'success', isVisible: true })
    } catch (e) {
      console.error('Delete error', e)
      setToast({ message: e.message || 'Delete failed', type: 'error', isVisible: true })
    } finally {
      setBusy('')
    }
  }

  const approveService = async (serviceId) => {
    try {
      const authHeaders = { Authorization: `Bearer ${token}` }
      await approveServiceRequest(serviceId, {}, authHeaders)
      await fetchServices()
      showToast('Service approved successfully', 'success')
    } catch (error) {
      console.error('Error approving service:', error)
      showToast('Failed to approve service', 'error')
    }
  }

  const rejectService = async (serviceId) => {
    try {
      const authHeaders = { Authorization: `Bearer ${token}` }
      await rejectServiceRequest(serviceId, {}, authHeaders)
      await fetchServices()
      showToast('Service rejected successfully', 'success')
    } catch (error) {
      console.error('Error rejecting service:', error)
      showToast('Failed to reject service', 'error')
    }
  }

  const filteredServices = services.filter((service) => {
    const title = (service.title || '').toLowerCase()
    const category = (service.category || '').toLowerCase()
    const providerName = (service.providerName || '').toLowerCase()
    const location = (service.location || '').toLowerCase()

    const matchSearch =
      title.includes(searchTerm.toLowerCase()) ||
      category.includes(searchTerm.toLowerCase()) ||
      providerName.includes(searchTerm.toLowerCase()) ||
      location.includes(searchTerm.toLowerCase())

    const serviceStatus = service.approvalStatus === 'rejected' ? 'rejected' : (service.approvalStatus === 'pending' ? 'pending' : (service.status || 'active'))
    const matchStatus =
      statusFilter === 'all' || serviceStatus === statusFilter

    return matchSearch && matchStatus
  })

  const stats = [
    { label: 'Total Services', value: services.length, icon: Users, color: 'cyan' },
    { label: 'Pending Approval', value: services.filter(s => (s.isApproved === false && s.status !== 'rejected') || s.status === 'pending').length, icon: Star, color: 'orange' },
    { label: 'Active Services', value: services.filter(s => s.isApproved === true && s.status !== 'pending' && s.status !== 'rejected').length, icon: CheckCircle, color: 'emerald' },
    { label: 'Rejected', value: services.filter(s => s.status === 'rejected').length, icon: XCircle, color: 'red' },
    { label: 'Total Revenue', value: formatMoney(services.reduce((sum, s) => sum + (s.revenue || 0), 0)), icon: DollarSign, color: 'yellow' }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-orange-500/10 text-orange-400 border-orange-500/20'
      case 'active': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'inactive': return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
      case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/20'
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
    }
  }

  const getIconColor = (color) => {
    switch (color) {
      case 'cyan': return 'text-cyan-400'
      case 'emerald': return 'text-emerald-400'
      case 'orange': return 'text-orange-400'
      case 'yellow': return 'text-custom-yellow'
      case 'red': return 'text-red-400'
      default: return 'text-white'
    }
  }

  if (isLoading) {
    return (
      <div className="p-10 text-white text-center">
        Loading services...
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      {/* Toast Notification */}
      {toast.isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="fixed top-4 right-4 z-50 max-w-sm"
        >
          <div className={`p-4 rounded-lg shadow-lg flex items-center gap-3 ${
            toast.type === 'error' 
              ? 'bg-red-500/90 border border-red-500/50 text-white' 
              : toast.type === 'success'
              ? 'bg-green-500/90 border border-green-500/50 text-white'
              : 'bg-yellow-500/90 border border-yellow-500/50 text-white'
          }`}>
            {toast.type === 'error' ? (
              <X className="w-5 h-5 flex-shrink-0" />
            ) : toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <p className="text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => setToast(prev => ({ ...prev, isVisible: false }))}
              className="ml-auto text-white/80 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Service View Modal */}
      {viewService && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setViewService(null)} />
          <div className="relative z-[100] max-w-3xl w-full p-6">
            <Card>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-1/2">
                  {viewService.images && viewService.images.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[420px] overflow-y-auto">
                        {(showAllImages ? viewService.images : viewService.images.slice(0, 4)).map((img, i) => (
                          <div key={i} className="relative overflow-hidden rounded-lg">
                            <img src={img} alt={`img-${i}`} className="w-full h-40 object-cover" />
                            {!showAllImages && i === 3 && viewService.images.length > 4 && (
                              <button
                                type="button"
                                onClick={() => setShowAllImages(true)}
                                className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-lg font-semibold"
                              >
                                +{viewService.images.length - 4} more
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      {viewService.images.length > 4 && (
                        <div className="mt-3 flex items-center gap-3">
                          <Button size="sm" variant="secondary" onClick={() => setShowAllImages(!showAllImages)}>
                            {showAllImages ? 'Show fewer images' : 'View all images'}
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-48 bg-slate-800 rounded-lg flex items-center justify-center text-slate-500">No images</div>
                  )}
                </div>
                <div className="md:w-1/2">
                  <h3 className="text-xl font-semibold text-white mb-2">{viewService.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">{viewService.description}</p>
                  <div className="space-y-2 text-sm text-slate-300">
                    <div><strong>Provider:</strong> {viewService.providerName}</div>
                    <div><strong>Category:</strong> {viewService.category}</div>
                    <div><strong>Location:</strong> {viewService.location}</div>
                    <div><strong>Price:</strong> {formatMoney(viewService.basePrice || viewService.price || 0)}</div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <Button variant="outline" onClick={() => setViewService(null)}>Close</Button>
                    <Button variant="danger" onClick={() => handleDeleteService(viewService)} disabled={busy === viewService.id}>Delete</Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">
            Manage Services
          </h1>
          <p className="text-slate-400 mt-1">
            Approve, reject, and manage all platform services
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                  <Icon className={`w-6 h-6 ${getIconColor(stat.color)}`} />
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by service name, category, provider, or location..."
              className="pl-12"
            />
          </div>

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'pending', label: 'Pending Approval' },
              { value: 'active', label: 'Active' },
              { value: 'rejected', label: 'Rejected' }
            ]}
          />
        </div>
      </Card>

      <div className="space-y-4">
        {filteredServices.length > 0 ? (
          filteredServices.map((service, index) => {
            const serviceStatus = service.approvalStatus === 'rejected' ? 'rejected' : (service.approvalStatus === 'pending' ? 'pending' : (service.status || 'active'))
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">{service.title?.[0]?.toUpperCase() || 'S'}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <h3 className="text-lg font-semibold text-white truncate">{service.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(serviceStatus)}`}>
                            {serviceStatus.charAt(0).toUpperCase() + serviceStatus.slice(1)}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm mb-2">{service.category}</p>
                        <p className="text-slate-300 text-sm line-clamp-2 mb-3">
                          {service.description}
                        </p>
                        <div className="flex items-center gap-4 flex-wrap text-sm text-slate-400">
                          {service.providerName && (
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {service.providerName}
                            </span>
                          )}
                          {service.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {service.location}
                            </span>
                          )}
                          {service.createdAt && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(service.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 min-w-fit lg:text-right">
                      <div>
                        <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Price</p>
                        <p className="text-2xl font-bold text-custom-yellow">{formatMoney(service.basePrice || service.price || 0)}</p>
                      </div>

                      <div className="flex items-center gap-2 justify-end pt-3 border-t border-white/5">
                        <Button variant="ghost" size="sm" onClick={() => openView(service)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteService(service)}>
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                        {serviceStatus === 'pending' && (
                          <>
                            <Button  variant="outline"size="sm" onClick={() => approveService(service.id)}>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => rejectService(service.id)}>
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })
        ) : (
          <Card className="p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/5">
              <Users className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No services found
            </h3>
            <p className="text-slate-400 max-w-md mx-auto">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters to find what you\'re looking for'
                : 'No services have been added yet. Services added by providers will appear here for approval.'
              }
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}

export default AdminManageServicesPage
