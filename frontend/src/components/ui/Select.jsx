import React from 'react'

const Select = ({ 
  label, 
  options = [], 
  className = '', 
  error = '',
  hint = '',
  required = false,
  ...props 
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-200">
          {label}
          {required && <span className="ml-1 text-rose-400">*</span>}
        </label>
      )}
      <select
        className={`w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white transition-all duration-200 focus:border-yellow-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/10 ${className} ${
          error ? 'border-rose-400/60 focus:border-rose-400/60 focus:ring-rose-400/10' : ''
        }`}
        {...props}
      >
       
        <option value="" className="bg-slate-950">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-slate-950">
            {option.label}
          </option>
        ))}
      </select>
      {hint && !error ? (
        <p className="text-sm text-slate-400">{hint}</p>
      ) : null}
      {error && (
        <p className="text-sm text-rose-400">{error}</p>
      )}
    </div>
  )
}

export default Select
