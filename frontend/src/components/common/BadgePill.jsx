import React from 'react'

const BadgePill = ({ children, className = '' }) => {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm border border-white/10 bg-white/5 ${className}`}>
      {children}
    </span>
  )
}

export default BadgePill
