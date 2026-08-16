import React from 'react'



const Input = ({ 

  label, 

  type = 'text', 

  placeholder = '', 

  className = '', 

  error = '',

  hint = '',

  icon: Icon,

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

      <div className="relative">

        {Icon ? (

          <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        ) : null}

        <input

          type={type}

          placeholder={placeholder}

          className={`w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 transition-all duration-200 focus:border-yellow-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/10 ${Icon ? 'pl-11' : ''} ${className} ${

            error ? 'border-rose-400/60 focus:border-rose-400/60 focus:ring-rose-400/10' : ''

          }`}

          {...props}

        />

      </div>

      {hint && !error ? (

        <p className="text-sm text-slate-400">{hint}</p>

      ) : null}

      {error && (

        <p className="text-sm text-rose-400">{error}</p>

      )}

    </div>

  )

}



export default Input

