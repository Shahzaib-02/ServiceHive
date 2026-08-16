import React from 'react'
import Glass3DCard from './Glass3DCard'

const MetricCard = ({ icon: Icon, label, value, delta, deltaPositive = true }) => {
  return (
    <Glass3DCard className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
          {Icon && <Icon className="w-6 h-6 text-cyan-400" />}
        </div>
        <div>
          <p className="text-gray-400 text-sm">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
      {delta !== undefined && (
        <span className={`px-2 py-1 rounded-lg text-sm ${deltaPositive ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
          {delta}
        </span>
      )}
    </Glass3DCard>
  )
}

export default MetricCard
