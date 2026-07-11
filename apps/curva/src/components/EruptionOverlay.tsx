import { motion, AnimatePresence } from 'framer-motion'
import './EruptionOverlay.css'

interface Props {
  chantLabel: string | null
  onComplete: () => void
}

export function EruptionOverlay({ chantLabel, onComplete }: Props) {
  // Generate confetti particles
  const confetti = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    rotation: Math.random() * 360,
    delay: Math.random() * 0.3,
    color: ['#f5c518', '#3dff9a', '#ff5d6c'][Math.floor(Math.random() * 3)]
  }))

  return (
    <AnimatePresence>
      {chantLabel && (
        <motion.div
          className="eruption-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onAnimationComplete={() => {
            setTimeout(onComplete, 2000)
          }}
        >
          {/* Background Flash */}
          <motion.div
            className="eruption-flash"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0, 1, 0.6, 0],
              scale: [0.8, 1.2, 1.4, 1.6]
            }}
            transition={{ 
              duration: 2,
              ease: [0.34, 1.56, 0.64, 1]
            }}
          />

          {/* Confetti Burst */}
          <div className="confetti-container">
            {confetti.map((particle) => (
              <motion.div
                key={particle.id}
                className="confetti-particle"
                style={{
                  left: `${particle.x}%`,
                  backgroundColor: particle.color,
                  transform: `rotate(${particle.rotation}deg)`
                }}
                initial={{ 
                  y: '50vh',
                  opacity: 0,
                  scale: 0
                }}
                animate={{ 
                  y: [0, -200, 600],
                  x: [(Math.random() - 0.5) * 400],
                  opacity: [0, 1, 1, 0],
                  scale: [0, 1, 1, 0.5],
                  rotate: [0, particle.rotation * 2]
                }}
                transition={{ 
                  duration: 3,
                  delay: particle.delay,
                  ease: 'easeOut'
                }}
              />
            ))}
          </div>

          {/* Eruption Text */}
          <motion.div
            className="eruption-content"
            initial={{ scale: 0.6, opacity: 0, y: 50 }}
            animate={{ 
              scale: [0.6, 1.1, 1],
              opacity: [0, 1, 1, 0.8],
              y: [50, -10, 0]
            }}
            transition={{ 
              duration: 1.5,
              times: [0, 0.4, 0.6],
              ease: [0.34, 1.56, 0.64, 1]
            }}
          >
            <motion.div
              className="eruption-icon"
              animate={{
                rotate: [0, -15, 15, -10, 10, 0],
                scale: [1, 1.2, 1, 1.1, 1]
              }}
              transition={{
                duration: 0.8,
                repeat: 2,
                ease: 'easeInOut'
              }}
            >
              🎉
            </motion.div>
            
            <h2 className="eruption-title">ERUPTION!</h2>
            
            <motion.p
              className="eruption-chant"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {chantLabel}
            </motion.p>
            
            <motion.div
              className="eruption-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ delay: 0.5, duration: 1.5 }}
            >
              The curva ROARS as one!
            </motion.div>
          </motion.div>

          {/* Radial Burst Lines */}
          <div className="burst-lines">
            {Array.from({ length: 16 }).map((_, i) => (
              <motion.div
                key={i}
                className="burst-line"
                style={{
                  transform: `rotate(${(i * 360) / 16}deg)`
                }}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ 
                  scaleY: [0, 1.5, 0],
                  opacity: [0, 0.6, 0]
                }}
                transition={{
                  duration: 1.2,
                  delay: i * 0.03,
                  ease: 'easeOut'
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
