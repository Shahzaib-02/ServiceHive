import React from 'react'

const SparkLine = ({ data = [], className = '' }) => {
  const max = Math.max(1, ...data)
  const width = 120
  const height = 40
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - (v / max) * height
      return `${x},${y}`
    })
    .join(' ')
  return (
    <svg width={width} height={height} className={className}>
      <polyline
        fill="none"
        stroke="url(#g)"
        strokeWidth="2"
        points={points}
      />
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default SparkLine
