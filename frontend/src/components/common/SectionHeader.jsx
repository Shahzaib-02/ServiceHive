import React from 'react'

const SectionHeader = ({ title, subtitle, center = true, className = '' }) => {
  return (
    <div className={`${center ? 'text-center' : ''} mb-8 ${className}`}>
      <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">{title}</h2>
      {subtitle && <p className="text-gray-300">{subtitle}</p>}
    </div>
  )
}

export default SectionHeader
