import React from 'react'

const Select = ({ 
  label, 
  options = [], 
  className = '', 
  error = '',
  required = false,
  ...props 
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        className={`w-full px-4 py-3 glass-card border border-white/20 rounded-xl text-white bg-dark/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 ${className} ${
          error ? 'border-red-500 focus:ring-red-500' : ''
        }`}
        {...props}
      >
        <option value="" className="bg-dark">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-dark">
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}

export default Select
