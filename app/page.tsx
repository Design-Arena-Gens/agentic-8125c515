'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scene, setScene] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const scenes = [
    { text: "A sunny afternoon on a busy highway...", duration: 3000 },
    { text: "A truck driver spots something ahead", duration: 3000 },
    { text: "A mother duck and her ducklings crossing the road!", duration: 3500 },
    { text: "He slams on the brakes!", duration: 2500 },
    { text: "The truck screeches to a halt", duration: 3000 },
    { text: "He jumps out and signals other cars to stop", duration: 4000 },
    { text: "Most ducklings make it safely across...", duration: 3500 },
    { text: "But one is frozen in fear on the road", duration: 3500 },
    { text: "The driver rushes to save it", duration: 2500 },
    { text: "A cyclist with headphones approaches, unaware", duration: 3500 },
    { text: "The driver scoops up the duckling just in time", duration: 3000 },
    { text: "But gets clipped by the cyclist...", duration: 2500 },
    { text: "He falls, cradling the duckling protectively", duration: 3500 },
    { text: "The cyclist finally realizes and stops in horror", duration: 3500 },
    { text: "The driver opens his hands...", duration: 2500 },
    { text: "The duckling is safe.", duration: 3000 },
    { text: "A hero's sacrifice for the smallest life", duration: 4000 }
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    let animationFrame: number
    let truckX = -200
    let duckX = canvas.width / 2
    let duckY = canvas.height / 2
    let ducklings: Array<{x: number, y: number, wobble: number}> = []
    let driverX = 0
    let driverY = 0
    let cyclistX = canvas.width + 200
    let skidMarks: Array<{x: number, y: number, length: number, opacity: number}> = []

    // Initialize ducklings
    for (let i = 0; i < 5; i++) {
      ducklings.push({
        x: duckX + (i - 2) * 30,
        y: duckY + 40 + Math.sin(i) * 10,
        wobble: i * 0.5
      })
    }

    const drawRoad = () => {
      // Road
      ctx.fillStyle = '#2a2a2a'
      ctx.fillRect(0, canvas.height / 2 - 150, canvas.width, 300)

      // Road lines
      ctx.strokeStyle = '#ffdd00'
      ctx.lineWidth = 4
      ctx.setLineDash([30, 20])
      ctx.beginPath()
      ctx.moveTo(0, canvas.height / 2)
      ctx.lineTo(canvas.width, canvas.height / 2)
      ctx.stroke()
      ctx.setLineDash([])

      // White edge lines
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 6
      ctx.beginPath()
      ctx.moveTo(0, canvas.height / 2 - 150)
      ctx.lineTo(canvas.width, canvas.height / 2 - 150)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, canvas.height / 2 + 150)
      ctx.lineTo(canvas.width, canvas.height / 2 + 150)
      ctx.stroke()

      // Skid marks
      skidMarks.forEach(mark => {
        ctx.strokeStyle = `rgba(20, 20, 20, ${mark.opacity})`
        ctx.lineWidth = 8
        ctx.beginPath()
        ctx.moveTo(mark.x, mark.y)
        ctx.lineTo(mark.x + mark.length, mark.y)
        ctx.stroke()
      })
    }

    const drawTruck = (x: number, y: number) => {
      // Truck body
      ctx.fillStyle = '#c41e3a'
      ctx.fillRect(x, y - 60, 180, 80)

      // Truck cabin
      ctx.fillStyle = '#8b1a2d'
      ctx.fillRect(x + 140, y - 90, 80, 50)

      // Windows
      ctx.fillStyle = '#87ceeb'
      ctx.fillRect(x + 145, y - 85, 30, 40)
      ctx.fillRect(x + 185, y - 85, 30, 40)

      // Wheels
      ctx.fillStyle = '#1a1a1a'
      ctx.beginPath()
      ctx.arc(x + 40, y + 20, 20, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(x + 160, y + 20, 20, 0, Math.PI * 2)
      ctx.fill()

      // Wheel rims
      ctx.fillStyle = '#888'
      ctx.beginPath()
      ctx.arc(x + 40, y + 20, 10, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(x + 160, y + 20, 10, 0, Math.PI * 2)
      ctx.fill()
    }

    const drawDuck = (x: number, y: number, size: number = 1) => {
      const s = size
      // Body
      ctx.fillStyle = '#ffd700'
      ctx.beginPath()
      ctx.ellipse(x, y, 25 * s, 20 * s, 0, 0, Math.PI * 2)
      ctx.fill()

      // Head
      ctx.beginPath()
      ctx.arc(x + 15 * s, y - 15 * s, 15 * s, 0, Math.PI * 2)
      ctx.fill()

      // Beak
      ctx.fillStyle = '#ff8c00'
      ctx.beginPath()
      ctx.moveTo(x + 25 * s, y - 15 * s)
      ctx.lineTo(x + 35 * s, y - 12 * s)
      ctx.lineTo(x + 25 * s, y - 10 * s)
      ctx.closePath()
      ctx.fill()

      // Eye
      ctx.fillStyle = '#000'
      ctx.beginPath()
      ctx.arc(x + 20 * s, y - 18 * s, 3 * s, 0, Math.PI * 2)
      ctx.fill()

      // Wing
      ctx.fillStyle = '#ffcc00'
      ctx.beginPath()
      ctx.ellipse(x - 5 * s, y, 15 * s, 10 * s, -0.3, 0, Math.PI * 2)
      ctx.fill()
    }

    const drawDriver = (x: number, y: number, lying: boolean = false) => {
      if (lying) {
        // Lying down
        ctx.fillStyle = '#0066cc'
        ctx.fillRect(x, y, 80, 30)
        ctx.fillStyle = '#ffdbac'
        ctx.beginPath()
        ctx.arc(x + 85, y + 15, 15, 0, Math.PI * 2)
        ctx.fill()
        // Arms cradling
        ctx.strokeStyle = '#ffdbac'
        ctx.lineWidth = 8
        ctx.beginPath()
        ctx.arc(x + 100, y + 15, 20, 0, Math.PI)
        ctx.stroke()
      } else {
        // Standing
        ctx.fillStyle = '#ffdbac'
        ctx.beginPath()
        ctx.arc(x, y - 60, 15, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#0066cc'
        ctx.fillRect(x - 15, y - 45, 30, 40)
        ctx.fillStyle = '#003d7a'
        ctx.fillRect(x - 12, y - 5, 24, 35)
        // Arms extended
        ctx.strokeStyle = '#ffdbac'
        ctx.lineWidth = 6
        ctx.beginPath()
        ctx.moveTo(x - 15, y - 35)
        ctx.lineTo(x - 40, y - 25)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(x + 15, y - 35)
        ctx.lineTo(x + 40, y - 25)
        ctx.stroke()
      }
    }

    const drawCyclist = (x: number, y: number) => {
      // Bike
      ctx.strokeStyle = '#333'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(x, y + 20, 15, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(x + 50, y + 20, 15, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(x, y + 20)
      ctx.lineTo(x + 25, y - 10)
      ctx.lineTo(x + 50, y + 20)
      ctx.stroke()

      // Cyclist
      ctx.fillStyle = '#ffdbac'
      ctx.beginPath()
      ctx.arc(x + 25, y - 25, 12, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#00aa00'
      ctx.fillRect(x + 15, y - 13, 20, 25)

      // Headphones
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.arc(x + 25, y - 25, 18, 0.7, 2.4)
      ctx.stroke()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Sky
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, '#87ceeb')
      gradient.addColorStop(1, '#e0f6ff')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height / 2 - 150)

      // Grass
      ctx.fillStyle = '#228b22'
      ctx.fillRect(0, 0, canvas.width, canvas.height / 2 - 150)
      ctx.fillRect(0, canvas.height / 2 + 150, canvas.width, canvas.height)

      drawRoad()

      const centerY = canvas.height / 2

      // Scene animations
      if (scene === 0 || scene === 1) {
        truckX += 3
        if (truckX > canvas.width / 3) truckX = canvas.width / 3
        drawTruck(truckX, centerY)
      }

      if (scene >= 2 && scene < 6) {
        drawTruck(truckX, centerY)
        // Ducklings walking
        ducklings.forEach((duckling, i) => {
          duckling.wobble += 0.1
          duckling.x += 0.5
          duckling.y = centerY + Math.sin(duckling.wobble) * 3
          drawDuck(duckling.x, duckling.y, 0.5)
        })
        duckX += 0.5
        drawDuck(duckX, centerY)
      }

      if (scene === 3) {
        // Braking - add skid marks
        if (Math.random() > 0.7) {
          skidMarks.push({
            x: truckX + 40,
            y: centerY + 20,
            length: 30,
            opacity: 0.8
          })
          skidMarks.push({
            x: truckX + 160,
            y: centerY + 20,
            length: 30,
            opacity: 0.8
          })
        }
      }

      if (scene >= 6 && scene <= 11) {
        drawTruck(truckX, centerY)
        driverX = truckX + 200
        driverY = centerY + 30

        if (scene >= 6 && scene <= 10) {
          drawDriver(driverX, driverY)
        }

        // Scared duckling
        const scaredDuckX = duckX + 50
        drawDuck(scaredDuckX, centerY + 5)

        if (scene >= 9) {
          cyclistX -= 4
          drawCyclist(cyclistX, centerY)
        }
      }

      if (scene >= 12) {
        drawTruck(truckX, centerY)
        cyclistX = duckX + 150
        drawCyclist(cyclistX, centerY)

        // Driver on ground
        drawDriver(duckX + 30, centerY + 10, true)

        if (scene >= 15) {
          // Safe duckling
          drawDuck(duckX + 70, centerY - 20, 0.5)
        }
      }

      animationFrame = requestAnimationFrame(animate)
    }

    if (isPlaying) {
      animate()
    }

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrame)
    }
  }, [scene, isPlaying])

  useEffect(() => {
    if (!isPlaying) return

    const timer = setTimeout(() => {
      if (scene < scenes.length - 1) {
        setScene(scene + 1)
      } else {
        setIsPlaying(false)
      }
    }, scenes[scene].duration)

    return () => clearTimeout(timer)
  }, [scene, isPlaying, scenes])

  const startAnimation = () => {
    setScene(0)
    setIsPlaying(true)
  }

  const restartAnimation = () => {
    setScene(0)
    setIsPlaying(true)
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />

      <AnimatePresence>
        {!isPlaying && scene === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.8)',
              zIndex: 10
            }}
          >
            <h1 style={{ fontSize: '3rem', marginBottom: '2rem', textAlign: 'center', padding: '0 2rem' }}>
              The Truck Driver's Heroic Rescue
            </h1>
            <button
              onClick={startAnimation}
              style={{
                padding: '1rem 3rem',
                fontSize: '1.5rem',
                background: '#c41e3a',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Watch Story
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPlaying && (
          <motion.div
            key={scene}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'absolute',
              bottom: '10%',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0,0,0,0.8)',
              padding: '2rem 3rem',
              borderRadius: '12px',
              maxWidth: '80%',
              textAlign: 'center',
              zIndex: 5
            }}
          >
            <p style={{ fontSize: '1.8rem', margin: 0 }}>{scenes[scene].text}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isPlaying && scene === scenes.length - 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.9)',
              zIndex: 10
            }}
          >
            <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center', padding: '0 2rem' }}>
              True heroism is measured not by size,<br />but by the size of one's heart.
            </h2>
            <button
              onClick={restartAnimation}
              style={{
                padding: '1rem 3rem',
                fontSize: '1.5rem',
                background: '#c41e3a',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Watch Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
