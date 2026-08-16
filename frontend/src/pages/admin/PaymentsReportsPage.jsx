// import React, { useState } from 'react'
// import { motion } from 'framer-motion'
// import { 
//   DollarSign, TrendingUp, TrendingDown, Download, Filter, Calendar,
//   CreditCard, BarChart3, PieChart, FileText, Eye, Search,
//   ArrowUpRight, ArrowDownRight, RefreshCw, AlertCircle
// } from 'lucide-react'
// import Button from "../../components/ui/Button";
// import Card from "../../components/ui/Card";
// import Input from "../../components/ui/Input";
// import Select from "../../components/ui/Select";

// const PaymentsReportsPage = () => {
//   const [timeFilter, setTimeFilter] = useState('month')
//   const [searchTerm, setSearchTerm] = useState('')
//   const [statusFilter, setStatusFilter] = useState('all')

//   const timeOptions = [
//     { value: 'week', label: 'This Week' },
//     { value: 'month', label: 'This Month' },
//     { value: 'quarter', label: 'This Quarter' },
//     { value: 'year', label: 'This Year' },
//     { value: 'all', label: 'All Time' }
//   ]

//   const statusOptions = [
//     { value: 'all', label: 'All Status' },
//     { value: 'completed', label: 'Completed' },
//     { value: 'pending', label: 'Pending' },
//     { value: 'failed', label: 'Failed' },
//     { value: 'refunded', label: 'Refunded' }
//   ]

//   const transactions = [
//     {
//       id: 1,
//       bookingId: 'BK001',
//       customer: 'Sarah Johnson',
//       provider: 'CleanPro Solutions',
//       service: 'Home Cleaning',
//       amount: 75,
//       platformFee: 7.5,
//       providerEarnings: 67.5,
//       date: '2024-01-20',
//       status: 'completed',
//       paymentMethod: 'credit_card',
//       commission: 10
//     },
//     {
//       id: 2,
//       bookingId: 'BK002',
//       customer: 'Mike Chen',
//       provider: 'TechMasters Inc',
//       service: 'Web Development',
//       amount: 500,
//       platformFee: 50,
//       providerEarnings: 450,
//       date: '2024-01-19',
//       status: 'completed',
//       paymentMethod: 'paypal',
//       commission: 10
//     },
//     {
//       id: 3,
//       bookingId: 'BK003',
//       customer: 'Emily Davis',
//       provider: 'AutoSpa Premium',
//       service: 'Car Detailing',
//       amount: 150,
//       platformFee: 15,
//       providerEarnings: 135,
//       date: '2024-01-18',
//       status: 'pending',
//       paymentMethod: 'credit_card',
//       commission: 10
//     },
//     {
//       id: 4,
//       bookingId: 'BK004',
//       customer: 'Robert Wilson',
//       provider: 'CleanPro Solutions',
//       service: 'Office Cleaning',
//       amount: 200,
//       platformFee: 20,
//       providerEarnings: 180,
//       date: '2024-01-17',
//       status: 'refunded',
//       paymentMethod: 'credit_card',
//       commission: 10
//     },
//     {
//       id: 5,
//       bookingId: 'BK005',
//       customer: 'Lisa Anderson',
//       provider: 'EduExperts',
//       service: 'Math Tutoring',
//       amount: 45,
//       platformFee: 4.5,
//       providerEarnings: 40.5,
//       date: '2024-01-16',
//       status: 'failed',
//       paymentMethod: 'debit_card',
//       commission: 10
//     }
//   ]

//   const filteredTransactions = transactions.filter(transaction => {
//     const matchesSearch = transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          transaction.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          transaction.service.toLowerCase().includes(searchTerm.toLowerCase())
//     const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter
//     return matchesSearch && matchesStatus
//   })

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30'
//       case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
//       case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/30'
//       case 'refunded': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
//       default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
//     }
//   }

//   const getPaymentMethodIcon = (method) => {
//     switch (method) {
//       case 'credit_card': return <CreditCard className="w-4 h-4" />
//       case 'debit_card': return <CreditCard className="w-4 h-4" />
//       case 'paypal': return <DollarSign className="w-4 h-4" />
//       default: return <CreditCard className="w-4 h-4" />
//     }
//   }

//   const stats = {
//     totalRevenue: transactions.reduce((sum, t) => sum + t.amount, 0),
//     platformFees: transactions.reduce((sum, t) => sum + t.platformFee, 0),
//     providerEarnings: transactions.reduce((sum, t) => sum + t.providerEarnings, 0),
//     totalTransactions: transactions.length,
//     completedTransactions: transactions.filter(t => t.status === 'completed').length,
//     pendingTransactions: transactions.filter(t => t.status === 'pending').length,
//     failedTransactions: transactions.filter(t => t.status === 'failed').length,
//     refundedTransactions: transactions.filter(t => t.status === 'refunded').length
//   }

//   const revenueData = [
//     { month: 'Jan', revenue: 5850, fees: 585, earnings: 5265 },
//     { month: 'Feb', revenue: 6200, fees: 620, earnings: 5580 },
//     { month: 'Mar', revenue: 7100, fees: 710, earnings: 6390 },
//     { month: 'Apr', revenue: 6800, fees: 680, earnings: 6120 },
//     { month: 'May', revenue: 7200, fees: 720, earnings: 6480 },
//     { month: 'Jun', revenue: 6900, fees: 690, earnings: 6210 }
//   ]

//   const paymentMethods = [
//     { method: 'Credit Card', count: 3, percentage: 60 },
//     { method: 'PayPal', count: 1, percentage: 20 },
//     { method: 'Debit Card', count: 1, percentage: 20 }
//   ]

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="flex items-center justify-between"
//       >
//         <div>
//           <h1 className="text-3xl font-bold text-white mb-2">Payments & Reports</h1>
//           <p className="text-gray-400">
//             Monitor transactions and generate financial reports
//           </p>
//         </div>
        
//         <div className="flex items-center space-x-2">
//           <Button variant="outline">
//             <RefreshCw className="w-4 h-4 mr-2" />
//             Refresh
//           </Button>
//           <Button variant="outline">
//             <Download className="w-4 h-4 mr-2" />
//             Export Report
//           </Button>
//           <Button>
//             <FileText className="w-4 h-4 mr-2" />
//             Generate Invoice
//           </Button>
//         </div>
//       </motion.div>

//       {/* Revenue Overview */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.1 }}
//           className="glass-card p-6 rounded-xl"
//         >
//           <div className="flex items-center justify-between mb-4">
//             <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
//               <DollarSign className="w-6 h-6 text-white" />
//             </div>
//             <div className="flex items-center space-x-1 text-green-500">
//               <TrendingUp className="w-4 h-4" />
//               <span className="text-sm">+18%</span>
//             </div>
//           </div>
//           <div className="text-2xl font-bold gradient-text mb-1">${stats.totalRevenue.toLocaleString()}</div>
//           <div className="text-gray-400 text-sm">Total Revenue</div>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//           className="glass-card p-6 rounded-xl"
//         >
//           <div className="flex items-center justify-between mb-4">
//             <div className="w-12 h-12 bg-gradient-to-r from-custom-yellow to-orange-500 rounded-xl flex items-center justify-center">
//               <CreditCard className="w-6 h-6 text-black" />
//             </div>
//             <div className="flex items-center space-x-1 text-custom-yellow">
//               <TrendingUp className="w-4 h-4" />
//               <span className="text-sm">+12%</span>
//             </div>
//           </div>
//           <div className="text-2xl font-bold gradient-text mb-1">${stats.platformFees.toLocaleString()}</div>
//           <div className="text-gray-400 text-sm">Platform Fees</div>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.3 }}
//           className="glass-card p-6 rounded-xl"
//         >
//           <div className="flex items-center justify-between mb-4">
//             <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
//               <BarChart3 className="w-6 h-6 text-white" />
//             </div>
//             <div className="flex items-center space-x-1 text-purple-500">
//               <TrendingUp className="w-4 h-4" />
//               <span className="text-sm">+15%</span>
//             </div>
//           </div>
//           <div className="text-2xl font-bold gradient-text mb-1">${stats.providerEarnings.toLocaleString()}</div>
//           <div className="text-gray-400 text-sm">Provider Earnings</div>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.4 }}
//           className="glass-card p-6 rounded-xl"
//         >
//           <div className="flex items-center justify-between mb-4">
//             <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
//               <FileText className="w-6 h-6 text-white" />
//             </div>
//             <div className="flex items-center space-x-1 text-yellow-500">
//               <TrendingUp className="w-4 h-4" />
//               <span className="text-sm">+8%</span>
//             </div>
//           </div>
//           <div className="text-2xl font-bold gradient-text mb-1">{stats.totalTransactions}</div>
//           <div className="text-gray-400 text-sm">Total Transactions</div>
//         </motion.div>
//       </div>

//       {/* Charts Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Revenue Chart */}
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.6, delay: 0.5 }}
//         >
//           <Card className="p-6">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-lg font-semibold text-white">Revenue Trend</h3>
//               <Select
//                 value={timeFilter}
//                 onChange={(e) => setTimeFilter(e.target.value)}
//                 options={timeOptions}
//                 className="w-32"
//               />
//             </div>
            
//             {/* Simple Chart */}
//             <div className="h-48 flex items-end justify-between space-x-2">
//               {revenueData.map((data, index) => (
//                 <div key={index} className="flex-1 flex flex-col items-center">
//                   <div className="w-full bg-gradient-to-t from-custom-yellow to-orange-500 rounded-t-lg relative group cursor-pointer">
//                     <div 
//                       className="w-full bg-gradient-to-t from-custom-yellow to-orange-500 rounded-t-lg transition-all duration-300 group-hover:from-yellow-400 group-hover:to-orange-400"
//                       style={{ height: `${(data.revenue / 7200) * 100}%` }}
//                     ></div>
//                     <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-dark/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
//                       ${data.revenue}
//                     </div>
//                   </div>
//                   <span className="text-xs text-gray-400 mt-2">
//                     {data.month}
//                   </span>
//                 </div>
//               ))}
//             </div>
            
//             <div className="grid grid-cols-3 gap-4 mt-6">
//               <div className="text-center">
//                 <div className="text-lg font-bold gradient-text">RS 40K</div>
//                 <div className="text-gray-400 text-xs">6 Months</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-lg font-bold gradient-text">RS 6.7K</div>
//                 <div className="text-gray-400 text-xs">Avg/Month</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-lg font-bold gradient-text">+15%</div>
//                 <div className="text-gray-400 text-xs">Growth</div>
//               </div>
//             </div>
//           </Card>
//         </motion.div>

//         {/* Payment Methods */}
//         <motion.div
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.6, delay: 0.6 }}
//         >
//           <Card className="p-6">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-lg font-semibold text-white">Payment Methods</h3>
//               <Button variant="ghost" size="sm">
//                 <PieChart className="w-4 h-4" />
//               </Button>
//             </div>
            
//             <div className="space-y-4">
//               {paymentMethods.map((method, index) => (
//                 <div key={index} className="space-y-2">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-3">
//                       <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
//                         method.method === 'Credit Card' ? 'bg-blue-500/20' :
//                         method.method === 'PayPal' ? 'bg-yellow-500/20' :
//                         'bg-green-500/20'
//                       }`}>
//                         {getPaymentMethodIcon(method.method.toLowerCase().replace(' ', '_'))}
//                       </div>
//                       <span className="text-white font-medium">{method.method}</span>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-white font-semibold">{method.count}</p>
//                       <p className="text-gray-400 text-xs">{method.percentage}%</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <div className="flex-1 bg-white/10 rounded-full h-2">
//                       <div 
//                         className="bg-gradient-to-r from-custom-yellow to-orange-500 h-2 rounded-full"
//                         style={{ width: `${method.percentage}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </Card>
//         </motion.div>
//       </div>

//       {/* Transaction Status */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, delay: 0.7 }}
//       >
//         <Card className="p-6">
//           <h3 className="text-lg font-semibold text-white mb-6">Transaction Status</h3>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <div className="text-center">
//               <div className="text-2xl font-bold gradient-text mb-1">{stats.completedTransactions}</div>
//               <div className="text-gray-400 text-sm">Completed</div>
//             </div>
//             <div className="text-center">
//               <div className="text-2xl font-bold gradient-text mb-1">{stats.pendingTransactions}</div>
//               <div className="text-gray-400 text-sm">Pending</div>
//             </div>
//             <div className="text-center">
//               <div className="text-2xl font-bold gradient-text mb-1">{stats.failedTransactions}</div>
//               <div className="text-gray-400 text-sm">Failed</div>
//             </div>
//             <div className="text-center">
//               <div className="text-2xl font-bold gradient-text mb-1">{stats.refundedTransactions}</div>
//               <div className="text-gray-400 text-sm">Refunded</div>
//             </div>
//           </div>
//         </Card>
//       </motion.div>

//       {/* Filters */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, delay: 0.8 }}
//       >
//         <Card className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div className="relative">
//               <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <Input
//                 placeholder="Search transactions..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-12"
//               />
//             </div>
            
//             <Select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               options={statusOptions}
//             />
            
//             <Select
//               value={timeFilter}
//               onChange={(e) => setTimeFilter(e.target.value)}
//               options={timeOptions}
//             />
            
//             <Button variant="outline">
//               <Filter className="w-4 h-4 mr-2" />
//               More Filters
//             </Button>
//           </div>
//         </Card>
//       </motion.div>

//       {/* Transactions Table */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, delay: 0.9 }}
//       >
//         <Card className="p-6">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-white/10">
//                   <th className="text-left py-3 px-4 text-gray-400 font-medium">Booking ID</th>
//                   <th className="text-left py-3 px-4 text-gray-400 font-medium">Customer</th>
//                   <th className="text-left py-3 px-4 text-gray-400 font-medium">Provider</th>
//                   <th className="text-left py-3 px-4 text-gray-400 font-medium">Amount</th>
//                   <th className="text-left py-3 px-4 text-gray-400 font-medium">Platform Fee</th>
//                   <th className="text-left py-3 px-4 text-gray-400 font-medium">Provider Earnings</th>
//                   <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
//                   <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredTransactions.map((transaction) => (
//                   <tr key={transaction.id} className="border-b border-white/5">
//                     <td className="py-3 px-4 text-white font-medium">{transaction.bookingId}</td>
//                     <td className="py-3 px-4 text-gray-300">{transaction.customer}</td>
//                     <td className="py-3 px-4 text-gray-300">{transaction.provider}</td>
//                     <td className="py-3 px-4 text-white font-semibold">${transaction.amount}</td>
//                     <td className="py-3 px-4 text-gray-300">${transaction.platformFee}</td>
//                     <td className="py-3 px-4 text-green-400 font-medium">${transaction.providerEarnings}</td>
//                     <td className="py-3 px-4 text-gray-300">{transaction.date}</td>
//                     <td className="py-3 px-4">
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(transaction.status)}`}>
//                         {transaction.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </Card>
//       </motion.div>
//     </div>
//   )
// }

// export default PaymentsReportsPage
