// import { useEffect, useRef, useCallback } from "react"

// export default function ParticlesCanvas() {
//   const canvasRef = useRef(null)
//   const particlesRef = useRef([])
//   const animationRef = useRef(0)
//   const mouseRef = useRef({ x: 0, y: 0, radius: 150 })

//   // Configurable parameters
//   const PARTICLE_SPEED = 3 // Speed multiplier (1-10)
//   const LINE_WIDTH = 0.9 // Connection line width (0.1-2)
//   const PARTICLE_COUNT_DIVISOR = 9000 // Lower = more particles

//   const initParticles = useCallback((width, height) => {
//     const particleCount = Math.floor((width * height) / PARTICLE_COUNT_DIVISOR)
//     const particles = []

//     for (let i = 0; i < particleCount; i++) {
//       particles.push({
//         x: Math.random() * width,
//         y: Math.random() * height,
//         vx: (Math.random() - 0.5) * PARTICLE_SPEED,
//         vy: (Math.random() - 0.5) * PARTICLE_SPEED,
//         radius: Math.random() * 0 + 0.4,
//       })
//     }

//     particlesRef.current = particles
//   }, [])

//   const drawParticles = useCallback((ctx, width, height) => {
//     const particles = particlesRef.current
//     const mouse = mouseRef.current
//     const connectionDistance = 120

//     ctx.clearRect(0, 0, width, height)

//     for (let i = 0; i < particles.length; i++) {
//       const p = particles[i]

//       p.x += p.vx
//       p.y += p.vy

//       if (p.x < 0 || p.x > width) p.vx *= -1
//       if (p.y < 0 || p.y > height) p.vy *= -1

//       p.x = Math.max(0, Math.min(width, p.x))
//       p.y = Math.max(0, Math.min(height, p.y))

//       const dx = p.x - mouse.x
//       const dy = p.y - mouse.y
//       const dist = Math.sqrt(dx * dx + dy * dy)

//       if (dist < mouse.radius) {
//         const force = (mouse.radius - dist) / mouse.radius
//         p.x += dx * force * 0.03
//         p.y += dy * force * 0.03
//       }

//       ctx.beginPath()
//       ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
//       ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
//       ctx.fill()

//       for (let j = i + 1; j < particles.length; j++) {
//         const p2 = particles[j]
//         const dx = p.x - p2.x
//         const dy = p.y - p2.y
//         const distance = Math.sqrt(dx * dx + dy * dy)

//         if (distance < connectionDistance) {
//           const opacity = 1 - distance / connectionDistance
//           ctx.beginPath()
//           ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})` 
//           ctx.lineWidth = LINE_WIDTH
//           ctx.moveTo(p.x, p.y)
//           ctx.lineTo(p2.x, p2.y)
//           ctx.stroke()
//         }
//       }
//     }
//   }, [])

//   useEffect(() => {
//     const canvas = canvasRef.current
//     if (!canvas) return

//     const ctx = canvas.getContext("2d")
//     if (!ctx) return

//     const resizeCanvas = () => {
//       const dpr = window.devicePixelRatio || 1
//       const rect = canvas.getBoundingClientRect()

//       canvas.width = rect.width * dpr
//       canvas.height = rect.height * dpr

//       ctx.scale(dpr, dpr)

//       canvas.style.width = `${rect.width}px` 
//       canvas.style.height = `${rect.height}px` 

//       initParticles(rect.width, rect.height)
//     }

//     const handleMouseMove = (e) => {
//       const rect = canvas.getBoundingClientRect()
//       mouseRef.current.x = e.clientX - rect.left
//       mouseRef.current.y = e.clientY - rect.top
//     }

//     const handleMouseLeave = () => {
//       mouseRef.current.x = -1000
//       mouseRef.current.y = -1000
//     }

//     const animate = () => {
//       const rect = canvas.getBoundingClientRect()
//       drawParticles(ctx, rect.width, rect.height)
//       animationRef.current = requestAnimationFrame(animate)
//     }

//     resizeCanvas()
//     window.addEventListener("resize", resizeCanvas)
//     canvas.addEventListener("mousemove", handleMouseMove)
//     canvas.addEventListener("mouseleave", handleMouseLeave)

//     animate()

//     return () => {
//       window.removeEventListener("resize", resizeCanvas)
//       canvas.removeEventListener("mousemove", handleMouseMove)
//       canvas.removeEventListener("mouseleave", handleMouseLeave)
//       cancelAnimationFrame(animationRef.current)
//     }
//   }, [initParticles, drawParticles])

//   return (
//     <canvas
//       ref={canvasRef}
//       className="particles-js-canvas-el"
//       style={{ 
//         position: "fixed", 
//         top: 0, 
//         left: 0, 
//         width: "100vw", 
//         height: "100vh",
//         zIndex: -1,
//         background: "transparent",
//         pointerEvents: "none",
//         opacity: 0.8
//       }}
//     />
//   )
// }



















import { useEffect, useRef, useCallback } from "react"

export default function ParticlesCanvas() {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const animationRef = useRef(0)
  const mouseRef = useRef({ x: 0, y: 0, radius: 150 })

  // FIX: Doubled the divisor (9000 → 18000) to halve the particle count.
  // On a 1920×1080 screen this drops from ~230 to ~115 particles, cutting the
  // O(n²) connection-line loop from ~26,000 to ~6,600 ops per frame — a 4×
  // reduction in per-frame CPU cost at 60 fps.
  const PARTICLE_SPEED = 3
  const LINE_WIDTH = 0.9
  const PARTICLE_COUNT_DIVISOR = 18000 // was 9000

  const initParticles = useCallback((width, height) => {
    const particleCount = Math.floor((width * height) / PARTICLE_COUNT_DIVISOR)
    const particles = []

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * PARTICLE_SPEED,
        vy: (Math.random() - 0.5) * PARTICLE_SPEED,
        radius: Math.random() * 0 + 0.4,
      })
    }

    particlesRef.current = particles
  }, [])

  const drawParticles = useCallback((ctx, width, height) => {
    const particles = particlesRef.current
    const mouse = mouseRef.current
    const connectionDistance = 120

    ctx.clearRect(0, 0, width, height)

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]

      p.x += p.vx
      p.y += p.vy

      if (p.x < 0 || p.x > width) p.vx *= -1
      if (p.y < 0 || p.y > height) p.vy *= -1

      p.x = Math.max(0, Math.min(width, p.x))
      p.y = Math.max(0, Math.min(height, p.y))

      const dx = p.x - mouse.x
      const dy = p.y - mouse.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius
        p.x += dx * force * 0.03
        p.y += dy * force * 0.03
      }

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
      ctx.fill()

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j]
        const dx = p.x - p2.x
        const dy = p.y - p2.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < connectionDistance) {
          const opacity = 1 - distance / connectionDistance
          ctx.beginPath()
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})` 
          ctx.lineWidth = LINE_WIDTH
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.stroke()
        }
      }
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()

      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr

      ctx.scale(dpr, dpr)

      canvas.style.width = `${rect.width}px` 
      canvas.style.height = `${rect.height}px` 

      initParticles(rect.width, rect.height)
    }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = e.clientX - rect.left
      mouseRef.current.y = e.clientY - rect.top
    }

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000
      mouseRef.current.y = -1000
    }

    // FIX: Skip animation frames when the tab is hidden (document.hidden).
    // This stops the O(n²) particle loop from consuming CPU while the user
    // is on another tab — which was amplifying the "Page Unresponsive" hang.
    const animate = () => {
      if (!document.hidden) {
        const rect = canvas.getBoundingClientRect()
        drawParticles(ctx, rect.width, rect.height)
      }
      animationRef.current = requestAnimationFrame(animate)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseleave", handleMouseLeave)

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
      cancelAnimationFrame(animationRef.current)
    }
  }, [initParticles, drawParticles])

  return (
    <canvas
      ref={canvasRef}
      className="particles-js-canvas-el"
      style={{ 
        position: "fixed", 
        top: 0, 
        left: 0, 
        width: "100vw", 
        height: "100vh",
        zIndex: -1,
        background: "transparent",
        pointerEvents: "none",
        opacity: 0.8
      }}
    />
  )
}