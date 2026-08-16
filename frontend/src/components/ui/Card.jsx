import React from 'react'
import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '', 
  hover = true,
  delay = 0,
  ...props 
}) => {
  const MotionComponent = hover ? motion.div : 'div'
  
  const motionProps = hover ? {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay, ease: 'easeOut' },
    whileHover: { 
      y: -6,
      scale: 1.01,
      boxShadow: '0 28px 60px rgba(8, 15, 31, 0.45)'
    },
    style: { transformStyle: 'preserve-3d' }
  } : {}

  return (
    <MotionComponent
      className={`surface-card p-6 ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </MotionComponent>
  )
}

export const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
)

export const CardBody = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
)

export const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-4 border-t border-white/10 pt-4 ${className}`}>
    {children}
  </div>
)

export default Card
