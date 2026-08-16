import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  DollarSign, TrendingUp, TrendingDown, Calendar, Download,
  Filter, Search, CreditCard, Wallet, FileText, Eye,
  ArrowUpRight, ArrowDownRight, BarChart3, PieChart
} from 'lucide-react'
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";

const EarningsPage = () => {
  const [timeFilter, setTimeFilter] = useState('month')
  const [searchTerm, setSearchTerm] = useState('')

  const timeOptions = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'all', label: 'All Time' }
  ]

  const earningsData = {
    week: [
      { day: 'Mon', earnings: 120 },
      { day: 'Tue', earnings: 200 },
      { day: 'Wed', earnings: 180 },
      { day: 'Thu', earnings: 250 },
      { day: 'Fri', earnings: 320 },
      { day: 'Sat', earnings: 280 },
      { day: 'Sun', earnings: 150 }
    ],
    month: [
      { week: 'Week 1', earnings: 1200 },
      { week: 'Week 2', earnings: 1450 },
      { week: 'Week 3', earnings: 1680 },
      { week: 'Week 4', earnings: 1520 }
    ],
    quarter: [
      { month: 'Jan', earnings: 5850 },
      { month: 'Feb', earnings: 6200 },
      { month: 'Mar', earnings: 7100 }
    ],
    year: [
      { month: 'Jan', earnings: 5850 },
      { month: 'Feb', earnings: 6200 },
      { month: 'Mar', earnings: 7100 },
      { month: 'Apr', earnings: 6800 },
      { month: 'May', earnings: 7200 },
      { month: 'Jun', earnings: 6900 },
      { month: 'Jul', earnings: 7500 },
      { month: 'Aug', earnings: 7800 },
      { month: 'Sep', earnings: 7100 },
      { month: 'Oct', earnings: 6900 },
      { month: 'Nov', earnings: 7200 },
      { month: 'Dec', earnings: 8500 }
    ]
  }

  const transactions = [
    {
      id: 1,
      customer: 'Sarah Johnson',
      service: 'Home Cleaning',
      date: '2024-01-20',
      amount: 75,
      status: 'completed',
      paymentMethod: 'credit_card',
      commission: 7.5,
      netEarnings: 67.5
    },
    {
      id: 2,
      customer: 'Mike Chen',
      service: 'Deep Carpet Cleaning',
      date: '2024-01-18',
      amount: 120,
      status: 'completed',
      paymentMethod: 'paypal',
      commission: 12,
      netEarnings: 108
    },
    {
      id: 3,
      customer: 'Emily Davis',
      service: 'Home Cleaning',
      date: '2024-01-15',
      amount: 75,
      status: 'completed',
      paymentMethod: 'credit_card',
      commission: 7.5,
      netEarnings: 67.5
    },
    {
      id: 4,
      customer: 'Robert Wilson',
      service: 'Office Cleaning',
      date: '2024-01-12',
      amount: 200,
      status: 'completed',
      paymentMethod: 'bank_transfer',
      commission: 20,
      netEarnings: 180
    }
  ]

  const currentData = earningsData[timeFilter] || earningsData.month
  const totalEarnings = currentData.reduce((sum, item) => sum + item.earnings, 0)
  const totalCommission = transactions.reduce((sum, t) => sum + t.commission, 0)
  const totalNetEarnings = transactions.reduce((sum, t) => sum + t.netEarnings, 0)

  const stats = [
    {
      label: 'Total Earnings',
      value: `$${totalEarnings.toLocaleString()}`,
      change: '+12%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'green'
    },
    {
      label: 'Net Earnings',
      value: `$${totalNetEarnings.toLocaleString()}`,
      change: '+10%',
      changeType: 'increase',
      icon: Wallet,
      color: 'cyan'
    },
    {
      label: 'Commission Paid',
      value: `$${totalCommission.toLocaleString()}`,
      change: '+5%',
      changeType: 'increase',
      icon: CreditCard,
      color: 'purple'
    },
    {
      label: 'Completed Jobs',
      value: transactions.length,
      change: '+8%',
      changeType: 'increase',
      icon: Calendar,
      color: 'yellow'
    }
  ]

  const serviceBreakdown = [
    { service: 'Home Cleaning', earnings: 3450, jobs: 46, percentage: 45 },
    { service: 'Deep Carpet Cleaning', earnings: 2160, jobs: 18, percentage: 28 },
    { service: 'Office Cleaning', earnings: 1200, jobs: 6, percentage: 16 },
    { service: 'Window Cleaning', earnings: 840, jobs: 12, percentage: 11 }
  ]

  const filteredTransactions = transactions.filter(transaction =>
    transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.service.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          <h1 className="text-3xl font-bold text-white mb-2">Earnings Overview</h1>
          <p className="text-gray-400">
            Track your income and financial performance
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <CreditCard className="w-4 h-4 mr-2" />
            Withdraw Funds
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
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-600 rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center space-x-1 text-sm ${
                stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'
              }`}>
                {stat.changeType === 'increase' ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                <span>{stat.change}</span>
              </div>
            </div>
            <div className="text-2xl font-bold gradient-text mb-1">{stat.value}</div>
            <div className="text-gray-400 text-sm">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Time Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Earnings Chart</h3>
            <Select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              options={timeOptions}
              className="w-40"
            />
          </div>
          
          {/* Chart */}
          <div className="h-64 flex items-end justify-between space-x-2">
            {currentData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gradient-to-t from-cyan-500 to-purple-500 rounded-t-lg relative group cursor-pointer">
                  <div 
                    className="w-full bg-gradient-to-t from-cyan-500 to-purple-500 rounded-t-lg transition-all duration-300 group-hover:from-cyan-400 group-hover:to-purple-400"
                    style={{ height: `${(data.earnings / Math.max(...currentData.map(d => d.earnings))) * 100}%` }}
                  ></div>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-dark/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ${data.earnings}
                  </div>
                </div>
                <span className="text-xs text-gray-400 mt-2">
                  {data.day || data.week || data.month}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Service Breakdown</h3>
              <Button variant="ghost" size="sm">
                <PieChart className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {serviceBreakdown.map((service, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{service.service}</span>
                    <span className="text-gray-400">${service.earnings}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full"
                        style={{ width: `${service.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-400 w-12 text-right">
                      {service.percentage}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{service.jobs} jobs</span>
                    <span>Avg: ${Math.round(service.earnings / service.jobs)}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
              <Button variant="ghost" size="sm">
                <FileText className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {filteredTransactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="glass-card p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{transaction.customer}</p>
                      <p className="text-gray-400 text-sm">{transaction.service}</p>
                      <p className="text-gray-500 text-xs">{transaction.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold gradient-text">${transaction.netEarnings}</p>
                      <p className="text-xs text-gray-400">Net earnings</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full mt-4">
              <Eye className="w-4 h-4 mr-2" />
              View All Transactions
            </Button>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Transactions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Transaction History</h3>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Customer</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Service</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Amount</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Commission</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Net Earnings</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-white/5">
                    <td className="py-3 px-4 text-white">{transaction.customer}</td>
                    <td className="py-3 px-4 text-gray-300">{transaction.service}</td>
                    <td className="py-3 px-4 text-gray-300">{transaction.date}</td>
                    <td className="py-3 px-4 text-white font-medium">${transaction.amount}</td>
                    <td className="py-3 px-4 text-gray-300">${transaction.commission}</td>
                    <td className="py-3 px-4 text-green-400 font-medium">${transaction.netEarnings}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default EarningsPage
