import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './PulseButton.css'

interface Props {
  kind: string
  label: string
  intensity: number
  icon?: string
  disabled?: boolean
  energyCost?: number // Percentage of energy required (0-100)
  cooldown?: number // Cooldown in seconds
  onClick: () => void
}

export function PulseButton({ 
  kind, 
  label, 
  intensity, 
  icon, 
  disabled = false, 
  energyCost = 20,
  cooldown = 0,
  onClick 
}: Props) {
  const [isPressed, setIsPressed] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)

  useEffect(() => {
    if (cooldown > 0) {
      setTimeRemaining(cooldown)
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 0.1) {
            clearInterval(interval)
            return 0
          }
          return prev - 0.1
        })
      }, 100)
      return () => clearInterval(interval)
    }
  }, [cooldown])

  const handleClick = () => {
    if (disabled || timeRemaining > 0) return
    
    setIsPressed(true)
    onClick()
    
    // Reset pressed state after animation
    setTimeout(() => setIsPressed(false), 600)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Support Enter and Space for activation (WCAG 2.1.1)
    if ((e.key === 'Enter' || e.key === ' ') && !isDisabled) {
      e.preventDefault()
      handleClick()
    }
  }

  const getIntensityColor = () => {
    if (intensity >= 5) return 'var(--rose)'
    if (intensity >= 3) return 'var(--gold)'
    return 'var(--mint)'
  }

  const isDisabled = disabled || timeRemaining > 0
  const cooldownProgress = cooldown > 0 ? (1 - timeRemaining / cooldown) * 100 : 100

  return (
    <motion.button
      type="button"
      className={`pulse-button ${isDisabled ? 'disabled' : ''} ${isPressed ? 'pressed' : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={isDisabled}
      aria-label={`${label} reaction - ${energyCost}% energy cost${timeRemaining > 0 ? `, cooling down for ${Math.ceil(timeRemaining)} seconds` : ''}`}
      aria-pressed={isPressed}
      aria-disabled={isDisabled}
      whileHover={{ scale: isDisabled ? 1 : 1.05, y: isDisabled ? 0 : -4 }}
      whileTap={{ scale: isDisabled ? 1 : 0.94 }}
      style={{
        '--pulse-color': getIntensityColor(),
      } as React.CSSProperties}
    >
      {/* Background Glow */}
      <div className="pulse-glow" />
      
      {/* Chromatic Flash Effect */}
      <AnimatePresence>
        {isPressed && (
          <motion.div
            className="chromatic-flash"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 1, 0], scale: [0.8, 1.4, 1.8] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      {/* Cooldown Progress Ring */}
      {timeRemaining > 0 && (
        <svg className="cooldown-ring" viewBox="0 0 100 100">
          <circle
            className="cooldown-ring-bg"
            cx="50"
            cy="50"
            r="48"
          />
          <motion.circle
            className="cooldown-ring-progress"
            cx="50"
            cy="50"
            r="48"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: cooldownProgress / 100 }}
            transition={{ duration: 0.1, ease: 'linear' }}
            style={{
              pathLength: cooldownProgress / 100,
            }}
          />
        </svg>
      )}

      {/* Icon or Emoji */}
      {icon && (
        <span className="pulse-icon" aria-hidden="true">
          {icon}
        </span>
      )}

      {/* Label */}
      <span className="pulse-label">{label}</span>

      {/* Energy Cost Bar */}
      <div className="energy-cost-bar">
        <div 
          className="energy-cost-fill" 
          style={{ width: `${energyCost}%` }}
        />
      </div>

      {/* Intensity Indicator */}
      <div className="intensity-dots" aria-label={`Intensity: ${intensity}`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`intensity-dot ${i < intensity ? 'active' : ''}`}
          />
        ))}
      </div>

      {/* Energy Ring Animation on Press */}
      <AnimatePresence>
        {isPressed && (
          <motion.div
            className="energy-ring"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      {/* Cooldown Timer Display */}
      <AnimatePresence>
        {timeRemaining > 0 && (
          <motion.div
            className="cooldown-timer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <span>{Math.ceil(timeRemaining)}s</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
