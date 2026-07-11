import { motion } from 'framer-motion'
import './ChantCard.css'

interface Props {
  id: string
  label: string
  isActive: boolean
  voiceCount?: number
  maxVoices?: number
  countdown?: number
  onClick: () => void
}

export function ChantCard({ 
  id, 
  label, 
  isActive, 
  voiceCount = 0, 
  maxVoices = 6,
  countdown,
  onClick 
}: Props) {
  const progress = maxVoices > 0 ? voiceCount / maxVoices : 0

  return (
    <motion.button
      type="button"
      className={`chant-card ${isActive ? 'active' : 'idle'}`}
      onClick={onClick}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Background Glow for Active State */}
      {isActive && (
        <motion.div
          className="chant-glow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      {/* Chant Label */}
      <span className="chant-label">{label}</span>

      {/* Progress Dots */}
      <div className="progress-dots" aria-label={`${voiceCount} of ${maxVoices} voices`}>
        {Array.from({ length: maxVoices }).map((_, i) => (
          <span
            key={i}
            className={`progress-dot ${i < voiceCount ? 'filled' : ''}`}
          />
        ))}
      </div>

      {/* Voice Count or Status */}
      <div className="chant-status">
        {isActive ? (
          <>
            <span className="voice-count">{voiceCount}/{maxVoices}</span>
            {countdown !== undefined && countdown > 0 && (
              <span className="countdown">
                ⏱ {countdown}s
              </span>
            )}
          </>
        ) : (
          <span className="chant-cta">start / join</span>
        )}
      </div>

      {/* Building Tension Indicator */}
      {isActive && voiceCount >= maxVoices * 0.7 && (
        <motion.div
          className="tension-ring"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ 
            scale: [0.9, 1.1, 0.9],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      )}

      {/* Eruption Ready Pulse */}
      {voiceCount >= maxVoices && (
        <motion.div
          className="eruption-pulse"
          initial={{ scale: 1, opacity: 1 }}
          animate={{ 
            scale: 1.5,
            opacity: 0
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeOut'
          }}
        />
      )}
    </motion.button>
  )
}
