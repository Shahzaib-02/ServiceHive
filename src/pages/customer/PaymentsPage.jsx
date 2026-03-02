import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  CreditCard, DollarSign, Calendar, Download, Filter,
  Search, Plus, Eye, CheckCircle, XCircle, Clock,
  TrendingUp, TrendingDown, Wallet, Receipt
} from 'lucide-react'
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";

const PaymentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' }
  ]

  const dateOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ]

  const transactions = [
    {
      id: 1,
      service: 'Home Cleaning Service',
      provider: 'CleanPro Solutions',
      amount: 75,
      date: '2024-01-20',
      status: 'completed',
      method: 'credit_card',
      bookingId: 'BK001',
      invoice: 'INV001'
    },
    {
      id: 2,
      service: 'Plumbing Repair',
      provider: 'QuickFix Plumbing',
      amount: 120,
      date: '2024-01-18',
      status: 'pending',
      method: 'paypal',
      bookingId: 'BK002',
      invoice: 'INV002'
    },
    {
      id: 3,
      service: 'Web Development',
      provider: 'TechMasters',
      amount: 500,
      date: '2024-01-15',
      status: 'completed',
      method: 'credit_card',
      bookingId: 'BK003',
      invoice: 'INV003'
    },
    {
      id: 4,
      service: 'Car Detailing',
      provider: 'AutoSpa Premium',
      amount: 150,
      date: '2024-01-10',
      status: 'refunded',
      method: 'credit_card',
      bookingId: 'BK004',
      invoice: 'INV004'
    },
    {
      id: 5,
      service: 'Personal Training',
      provider: 'FitLife Coaching',
      amount: 80,
      date: '2024-01-08',
      status: 'failed',
      method: 'debit_card',
      bookingId: 'BK005',
      invoice: 'INV005'
    }
  ]

  const paymentMethods = [
    {
      id: 1,
      type: 'credit_card',
      last4: '4242',
      brand: 'Visa',
      expiry: '12/25',
      isDefault: true
    },
    {
      id: 2,
      type: 'debit_card',
      last4: '8888',
      brand: 'Mastercard',
      expiry: '09/24',
      isDefault: false
    },
    {
      id: 3,
      type: 'paypal',
      email: 'john.doe@example.com',
      isDefault: false
    }
  ]

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.provider.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'refunded': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'failed': return <XCircle className="w-4 h-4" />
      case 'refunded': return <TrendingDown className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getMethodIcon = (method) => {
    switch (method) {
      case 'credit_card': return <CreditCard className="w-4 h-4" />
      case 'debit_card': return <CreditCard className="w-4 h-4" />
      case 'paypal': return <Wallet className="w-4 h-4" />
      default: return <CreditCard className="w-4 h-4" />
    }
  }

  const stats = [
    {
      label: 'Total Spent',
      value: '$1,847',
      change: '+12%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'green'
    },
    {
      label: 'Pending Payments',
      value: '$120',
      change: '1 payment',
      changeType: 'neutral',
      icon: Clock,
      color: 'yellow'
    },
    {
      label: 'Refunded',
      value: '$150',
      change: '-8%',
      changeType: 'decrease',
      icon: TrendingDown,
      color: 'purple'
    },
    {
      label: 'Saved Methods',
      value: '3',
      change: '+1',
      changeType: 'increase',
      icon: CreditCard,
      color: 'cyan'
    }
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
          <h1 className="text-3xl font-bold text-white mb-2">Payment History</h1>
          <p className="text-gray-400">
            Manage your payments and view transaction history
          </p>
        </div>
        
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Payment Method
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
                stat.changeType === 'increase' ? 'text-green-500' :
                stat.changeType === 'decrease' ? 'text-red-500' : 'text-gray-500'
              }`}>
                {stat.changeType === 'increase' && <TrendingUp className="w-4 h-4" />}
                {stat.changeType === 'decrease' && <TrendingDown className="w-4 h-4" />}
                <span>{stat.change}</span>
              </div>
            </div>
            <div className="text-2xl font-bold gradient-text mb-1">{stat.value}</div>
            <div className="text-gray-400 text-sm">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transactions */}
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
                  placeholder="Search transactions..."
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
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                options={dateOptions}
              />
              
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </Card>

          {/* Transactions List */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
              
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className="glass-card p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
                          {getMethodIcon(transaction.method)}
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{transaction.service}</h4>
                          <p className="text-sm text-gray-400">{transaction.provider}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-500">{transaction.date}</span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500">Booking #{transaction.bookingId}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-semibold text-white">${transaction.amount}</div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 justify-end mt-1 ${getStatusColor(transaction.status)}`}>
                          {getStatusIcon(transaction.status)}
                          <span>{transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                      <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm">
                          <Receipt className="w-4 h-4 mr-2" />
                          Invoice
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                      
                      {transaction.status === 'pending' && (
                        <Button size="sm">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Pay Now
                        </Button>
                      )}
                      
                      {transaction.status === 'failed' && (
                        <Button variant="outline" size="sm">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Retry Payment
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-6"
        >
          {/* Payment Methods */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Payment Methods</h3>
              <Button variant="ghost" size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div key={method.id} className="glass-card p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
                        {getMethodIcon(method.type)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium">
                            {method.type === 'paypal' ? method.email : `${method.brand} •••• ${method.last4}`}
                          </span>
                          {method.isDefault && (
                            <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-full text-xs">
                              Default
                            </span>
                          )}
                        </div>
                        {method.type !== 'paypal' && (
                          <p className="text-sm text-gray-400">Expires {method.expiry}</p>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-3" />
                Download Statement
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Receipt className="w-4 h-4 mr-3" />
                View Invoices
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CreditCard className="w-4 h-4 mr-3" />
                Manage Cards
              </Button>
            </div>
          </Card>

          {/* Security Info */}
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Security & Privacy</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-white text-sm font-medium">SSL Encrypted</p>
                  <p className="text-gray-400 text-xs">All transactions are secure</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-white text-sm font-medium">PCI Compliant</p>
                  <p className="text-gray-400 text-xs">Industry standard security</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-white text-sm font-medium">Fraud Protection</p>
                  <p className="text-gray-400 text-xs">24/7 monitoring</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default PaymentsPage
