import { useState } from 'react'
import { motion } from 'framer-motion'
import './PulseButton.css'

interface Props {
  kind: string
  label: string
  intensity: number
  icon?: string
  disabled?: boolean
  onClick: () => void
}

export function PulseButton({ kind, label, intensity, icon, disabled = false, onClick }: Props) {
  const [isPressed, setIsPressed] = useState(false)

  const handleClick = () => {
    if (disabled) return
    
    setIsPressed(true)
    onClick()
    
    // Reset pressed state after animation
    setTimeout(() => setIsPressed(false), 600)
  }

  const getIntensityColor = () => {
    if (intensity >= 5) return 'var(--rose)'
    if (intensity >= 3) return 'var(--gold)'
    return 'var(--mint)'
  }

  return (
    <motion.button
      type="button"
      className={`pulse-button ${disabled ? 'disabled' : ''} ${isPressed ? 'pressed' : ''}`}
      onClick={handleClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05, y: disabled ? 0 : -4 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      style={{
        '--pulse-color': getIntensityColor(),
      } as React.CSSProperties}
    >
      {/* Background Glow */}
      <div className="pulse-glow" />
      
      {/* Chromatic Flash Effect */}
      {isPressed && (
        <motion.div
          className="chromatic-flash"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 1, 0], scale: [0.8, 1.4, 1.8] }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      )}

      {/* Icon or Emoji */}
      {icon && (
        <span className="pulse-icon" aria-hidden="true">
          {icon}
        </span>
      )}

      {/* Label */}
      <span className="pulse-label">{label}</span>

      {/* Intensity Indicator */}
      <div className="intensity-dots" aria-label={`Intensity: ${intensity}`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`intensity-dot ${i < intensity ? 'active' : ''}`}
          />
        ))}
      </div>

      {/* Energy Ring Animation */}
      {isPressed && (
        <motion.div
          className="energy-ring"
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      )}
    </motion.button>
  )
}
