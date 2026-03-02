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
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay },
    whileHover: { 
      scale: 1.02, 
      rotateY: 5,
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
    },
    style: { transformStyle: 'preserve-3d' }
  } : {}

  return (
    <MotionComponent
      className={`glass-card p-6 ${className}`}
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
  <div className={`mt-4 pt-4 border-t border-white/10 ${className}`}>
    {children}
  </div>
)

export default Card
