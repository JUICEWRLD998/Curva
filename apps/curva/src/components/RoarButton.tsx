import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './RoarButton.css'

interface Props {
  disabled?: boolean
  cooldown?: number // Cooldown in seconds (optional)
  energy?: number // Current energy level (0-100)
  onClick: () => void
}

export function RoarButton({ disabled = false, cooldown = 0, energy = 100, onClick }: Props) {
  const [isPressed, setIsPressed] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)

  useEffect(() => {
    if (cooldown > 0) {
      setTimeRemaining(cooldown)
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [cooldown])

  const handleClick = () => {
    if (disabled || timeRemaining > 0) return
    
    setIsPressed(true)
    onClick()
    
    // Reset pressed state after animation
    setTimeout(() => setIsPressed(false), 1000)
  }

  const isDisabled = disabled || timeRemaining > 0
  
  // Energy color based on level
  const getEnergyColor = () => {
    if (energy >= 70) return 'var(--mint)'
    if (energy >= 40) return 'var(--gold)'
    return 'var(--rose)'
  }

  // Generate particle positions (12 particles in a circle)
  const particles = Array.from({ length: 12 }).map((_, i) => {
    const angle = (i / 12) * 360
    return { angle, id: i }
  })

  return (
    <motion.button
      type="button"
      className={`roar-button ${isDisabled ? 'disabled' : ''} ${isPressed ? 'pressed' : ''}`}
      onClick={handleClick}
      disabled={isDisabled}
      whileHover={{ scale: isDisabled ? 1 : 1.04, y: isDisabled ? 0 : -6 }}
      whileTap={{ scale: isDisabled ? 1 : 0.96 }}
      style={{
        '--energy-color': getEnergyColor(),
      } as React.CSSProperties}
    >
      {/* Base Glow */}
      <div className="roar-glow" />
      
      {/* Energy Gauge Ring */}
      <svg className="energy-gauge-ring" viewBox="0 0 100 100">
        <circle
          className="energy-gauge-bg"
          cx="50"
          cy="50"
          r="46"
        />
        <motion.circle
          className="energy-gauge-fill"
          cx="50"
          cy="50"
          r="46"
          initial={{ pathLength: 0 }}
          animate={{ 
            pathLength: energy / 100,
            rotate: [0, 360]
          }}
          transition={{
            pathLength: { duration: 0.5, ease: 'easeOut' },
            rotate: { duration: 20, ease: 'linear', repeat: Infinity }
          }}
          style={{
            stroke: getEnergyColor(),
          }}
        />
      </svg>
      
      {/* Expanding Energy Ring on Press */}
      <AnimatePresence>
        {isPressed && (
          <motion.div
            className="energy-ring-expand"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      {/* Chromatic Burst Effect */}
      <AnimatePresence>
        {isPressed && (
          <motion.div
            className="chromatic-burst"
            initial={{ opacity: 0, scale: 0.6, rotate: 0 }}
            animate={{ 
              opacity: [0, 1, 0], 
              scale: [0.6, 1.5, 2],
              rotate: 360
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      {/* Particle Burst */}
      <AnimatePresence>
        {isPressed && (
          <div className="particle-burst">
            {particles.map(({ angle, id }) => (
              <motion.div
                key={id}
                className="particle"
                initial={{ 
                  x: 0, 
                  y: 0, 
                  opacity: 1,
                  scale: 0
                }}
                animate={{ 
                  x: Math.cos((angle * Math.PI) / 180) * 120,
                  y: Math.sin((angle * Math.PI) / 180) * 120,
                  opacity: 0,
                  scale: [0, 1, 0.5]
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 0.8, 
                  ease: 'easeOut',
                  delay: 0.05 * id
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Icon */}
      <motion.span 
        className="roar-icon" 
        aria-hidden="true"
        animate={isPressed ? { 
          scale: [1, 1.3, 1],
          rotate: [0, -10, 10, 0]
        } : {}}
        transition={{ duration: 0.4 }}
      >
        ⚡
      </motion.span>

      {/* Label */}
      <span className="roar-label">ROAR</span>

      {/* Energy Level Display */}
      {!isDisabled && energy < 100 && (
        <motion.div 
          className="energy-display"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <span className="energy-value">{Math.round(energy)}%</span>
        </motion.div>
      )}

      {/* Cooldown Overlay */}
      <AnimatePresence>
        {timeRemaining > 0 && (
          <motion.div
            className="cooldown-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <span className="cooldown-text">{timeRemaining}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
