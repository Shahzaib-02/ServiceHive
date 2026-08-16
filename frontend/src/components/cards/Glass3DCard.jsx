import React from 'react'
import { motion } from 'framer-motion'

const Glass3DCard = ({ children, className = '', rotate = 6, scale = 1.03 }) => {
  return (
    <motion.div
      className={`glass-card p-6 ${className}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ 
        scale, 
        rotateX: rotate, 
        rotateY: rotate / 2, 
        boxShadow: '0 25px 60px rgba(0,0,0,0.35)' 
      }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  )
}

export default Glass3DCard
