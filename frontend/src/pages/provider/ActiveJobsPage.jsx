






import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, Filter, Calendar, Clock, MapPin, DollarSign, User,
  CheckCircle, XCircle, MessageCircle, Phone, Navigation, Star,
  Play, Pause, Square, Camera, FileText, AlertCircle, Eye
} from 'lucide-react'
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import BookingChatDrawer from "../../components/chat/BookingChatDrawer"; // ← NEW

const ActiveJobsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('start_time')

  // ── NEW: chat drawer state ───────────────────────────────────────────────
  const [chatOpen, setChatOpen] = useState(false)
  const [chatJob, setChatJob] = useState(null) // { id, customer }

  const openChat = (job) => {
    setChatJob(job)
    setChatOpen(true)
  }
  const closeChat = () => {
    setChatOpen(false)
    setChatJob(null)
  }
  // ────────────────────────────────────────────────────────────────────────

  const statusOptions = [
    { value: 'all', label: 'All Jobs' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed Today' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  const sortOptions = [
    { value: 'start_time', label: 'Start Time' },
    { value: 'customer', label: 'Customer Name' },
    { value: 'service', label: 'Service Type' },
    { value: 'price', label: 'Price' }
  ]

  // NOTE: In production replace this with real API data from useBookings()
  // Chat is available for 'scheduled' and 'in_progress' jobs (booking is accepted)
  const activeJobs = [
    {
      id: 1,
      customer: 'Sarah Johnson',
      customerAvatar: 'SJ',
      customerRating: 4.9,
      service: 'Home Cleaning',
      date: '2024-01-20',
      startTime: '10:00 AM',
      endTime: '1:00 PM',
      location: 'Manhattan, NY',
      price: 75,
      status: 'in_progress',
      startedAt: '10:05 AM',
      progress: 65,
      notes: 'Customer requested extra attention to kitchen area',
      photos: [],
      checklist: [
        { task: 'Living room cleaning', completed: true },
        { task: 'Kitchen cleaning', completed: true },
        { task: 'Bedroom cleaning', completed: false },
        { task: 'Bathroom cleaning', completed: false }
      ]
    },
    {
      id: 2,
      customer: 'Mike Chen',
      customerAvatar: 'MC',
      customerRating: 4.7,
      service: 'Deep Carpet Cleaning',
      date: '2024-01-20',
      startTime: '2:00 PM',
      endTime: '5:00 PM',
      location: 'Brooklyn, NY',
      price: 120,
      status: 'scheduled',
      progress: 0,
      notes: 'Bring extra cleaning supplies for pet stains',
      photos: [],
      checklist: []
    },
    {
      id: 3,
      customer: 'Emily Davis',
      customerAvatar: 'ED',
      customerRating: 5.0,
      service: 'Home Cleaning',
      date: '2024-01-20',
      startTime: '4:00 PM',
      endTime: '6:00 PM',
      location: 'Queens, NY',
      price: 75,
      status: 'scheduled',
      progress: 0,
      notes: 'Regular customer - same as last time',
      photos: [],
      checklist: []
    },
    {
      id: 4,
      customer: 'Robert Wilson',
      customerAvatar: 'RW',
      customerRating: 4.5,
      service: 'Office Cleaning',
      date: '2024-01-19',
      startTime: '3:00 PM',
      endTime: '6:00 PM',
      location: 'Manhattan, NY',
      price: 200,
      status: 'completed',
      progress: 100,
      notes: 'Job completed successfully',
      photos: ['before1', 'after1', 'before2', 'after2'],
      checklist: [
        { task: 'Dusting and wiping surfaces', completed: true },
        { task: 'Vacuuming carpets', completed: true },
        { task: 'Cleaning bathrooms', completed: true },
        { task: 'Trash removal', completed: true }
      ]
    }
  ]

  // Chat allowed when booking is accepted (scheduled or in_progress)
  const canChat = (job) => ['scheduled', 'in_progress'].includes(job.status)

  const filteredJobs = activeJobs.filter(job => {
    const matchesSearch = job.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':  return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'in_progress': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'completed':  return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'cancelled':  return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:           return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled':  return <Calendar className="w-4 h-4" />
      case 'in_progress': return <Play className="w-4 h-4" />
      case 'completed':  return <CheckCircle className="w-4 h-4" />
      case 'cancelled':  return <XCircle className="w-4 h-4" />
      default:           return <Clock className="w-4 h-4" />
    }
  }

  const ActiveJobCard = ({ job }) => (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">{job.customerAvatar}</span>
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h3 className="font-semibold text-white">{job.customer}</h3>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-300">{job.customerRating}</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm">{job.service}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(job.status)}`}>
                  {getStatusIcon(job.status)}
                  <span>{job.status.replace('_', ' ').charAt(0).toUpperCase() + job.status.replace('_', ' ').slice(1)}</span>
                </span>
                {job.status === 'in_progress' && (
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium animate-pulse">
                    LIVE
                  </span>
                )}
                {/* ── NEW: Chat available badge ─────────────────────────── */}
                {canChat(job) && (
                  <button
                    onClick={() => openChat(job)}
                    className="flex items-center gap-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 px-2 py-1 text-xs font-medium text-cyan-400 hover:bg-cyan-500/25 transition-colors"
                  >
                    <MessageCircle className="h-3 w-3" />
                    Chat
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold gradient-text">${job.price}</div>
            <div className="text-sm text-gray-400">{job.startTime} - {job.endTime}</div>
          </div>
        </div>

        {job.notes && (
          <div className="glass-card p-3 rounded-lg mb-4">
            <p className="text-gray-300 text-sm">
              <span className="font-medium">Notes:</span> {job.notes}
            </p>
          </div>
        )}

        {job.status === 'in_progress' && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Progress</span>
              <span className="text-sm text-white font-medium">{job.progress}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${job.progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {job.status === 'in_progress' && job.checklist.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-white mb-2">Task Checklist</h4>
            <div className="space-y-2">
              {job.checklist.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => {}}
                    className="w-4 h-4 bg-white/10 border-white/20 rounded text-cyan-500"
                  />
                  <span className={`text-sm ${item.completed ? 'text-gray-300 line-through' : 'text-white'}`}>
                    {item.task}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{job.date}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{job.startTime}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
          </div>
        </div>

        {job.status === 'completed' && job.photos.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-white mb-2">Job Photos</h4>
            <div className="grid grid-cols-4 gap-2">
              {job.photos.map((photo, index) => (
                <div key={index} className="aspect-square bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                  <Camera className="w-6 h-6 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-1" />
              View Details
            </Button>
            {/* ── NEW: Message button opens chat drawer ─────────────────── */}
            {canChat(job) ? (
              <Button variant="outline" size="sm" onClick={() => openChat(job)}>
                <MessageCircle className="w-4 h-4 mr-1" />
                Message
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>
                <MessageCircle className="w-4 h-4 mr-1" />
                Message
              </Button>
            )}
            <Button variant="outline" size="sm">
              <Phone className="w-4 h-4 mr-1" />
              Call
            </Button>
          </div>
          
          {job.status === 'scheduled' && (
            <div className="flex items-center space-x-2">
              <Button size="sm">
                <Navigation className="w-4 h-4 mr-1" />
                Get Directions
              </Button>
              <Button variant="outline" size="sm">
                <Play className="w-4 h-4 mr-1" />
                Start Job
              </Button>
            </div>
          )}
          
          {job.status === 'in_progress' && (
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Camera className="w-4 h-4 mr-1" />
                Add Photo
              </Button>
              <Button variant="outline" size="sm">
                <Pause className="w-4 h-4 mr-1" />
                Pause
              </Button>
              <Button size="sm">
                <CheckCircle className="w-4 h-4 mr-1" />
                Complete
              </Button>
            </div>
          )}
          
          {job.status === 'completed' && (
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-1" />
                Invoice
              </Button>
              <Button size="sm">
                <Star className="w-4 h-4 mr-1" />
                Request Review
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  )

  const stats = [
    { label: "Today's Jobs", value: activeJobs.filter(j => j.date === '2024-01-20').length, color: 'cyan' },
    { label: 'In Progress', value: activeJobs.filter(j => j.status === 'in_progress').length, color: 'green' },
    { label: 'Completed', value: activeJobs.filter(j => j.status === 'completed').length, color: 'purple' },
    { label: "Today's Earnings", value: `$${activeJobs.filter(j => j.status === 'completed').reduce((sum, j) => sum + j.price, 0)}`, color: 'yellow' }
  ]

  return (
    <div className="space-y-6">
      {/* ── NEW: Chat Drawer ─────────────────────────────────────────────── */}
      <BookingChatDrawer
        bookingId={chatJob?.id ? String(chatJob.id) : null}
        title={chatJob ? `Chat with ${chatJob.customer}` : 'Chat'}
        isOpen={chatOpen}
        onClose={closeChat}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Active Jobs</h1>
          <p className="text-gray-400">Manage your ongoing and scheduled service jobs</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            View Calendar
          </Button>
          <Button>
            <Navigation className="w-4 h-4 mr-2" />
            Start Navigation
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
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12"
              />
            </div>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={statusOptions} />
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} options={sortOptions} />
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Current Job Alert */}
      {activeJobs.filter(j => j.status === 'in_progress').length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="border-2 border-green-500/30 bg-green-500/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="text-white font-medium">Job In Progress</p>
                  <p className="text-gray-400 text-sm">
                    {activeJobs.find(j => j.status === 'in_progress')?.customer} - {activeJobs.find(j => j.status === 'in_progress')?.service}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* ── Quick Chat from alert bar ─────────────────────────── */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openChat(activeJobs.find(j => j.status === 'in_progress'))}
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Chat
                </Button>
                <Button size="sm">
                  <Navigation className="w-4 h-4 mr-1" />
                  Track Live
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ActiveJobCard job={job} />
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
              <Calendar className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No active jobs found</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || statusFilter !== 'all' ? 'Try adjusting your search or filters' : 'No jobs scheduled for today'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ActiveJobsPage