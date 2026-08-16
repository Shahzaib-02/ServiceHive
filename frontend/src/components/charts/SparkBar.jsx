import React from 'react'

const SparkBar = ({ data = [], className = '' }) => {
  const max = Math.max(1, ...data)
  return (
    <div className={`flex items-end space-x-1 h-16 ${className}`}>
      {data.map((v, i) => (
        <div
          key={i}
          className="w-2 bg-gradient-to-t from-cyan-500 to-purple-500 rounded-t"
          style={{ height: `${(v / max) * 100}%` }}
        />
      ))}
    </div>
  )
}

export default SparkBar
