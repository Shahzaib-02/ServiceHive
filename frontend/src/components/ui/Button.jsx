import React from 'react'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  onClick,
  type = 'button',
  ...props 
}) => {

  const baseClasses =
    'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-custom-yellow/60 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:pointer-events-none'

  // Transparent by default + hover color
  const variants = {
    primary:
      'bg-transparent text-custom-yellow border border-custom-yellow/40 hover:bg-custom-yellow hover:text-slate-950 hover:-translate-y-0.5 hover:shadow-lg',

    secondary:
      'bg-transparent text-white border border-white/20 hover:bg-white hover:text-slate-950 hover:-translate-y-0.5',

    outline:
      'bg-transparent text-yellow-400 border border-yellow-400/40 hover:bg-yellow-400 hover:text-black hover:-translate-y-0.5',

    ghost:
      'bg-transparent text-slate-300 hover:bg-white/10 hover:text-slate-950 hover:-translate-y-0.5',

    danger:
      'bg-transparent text-rose-400 border border-rose-400/40 hover:bg-rose-500 hover:text-slate-950 hover:-translate-y-0.5',

    success:
      'bg-transparent text-emerald-400 border border-emerald-400/40 hover:bg-emerald-500 hover:text-slate-950 hover:-translate-y-0.5',
  }

  const sizes = {
    sm: 'px-3.5 py-2 text-sm',
    md: 'px-5 py-3 text-sm sm:text-base',
    lg: 'px-6 py-3.5 text-base',
    xl: 'px-8 py-4 text-lg',
  }

  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
  `

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button;