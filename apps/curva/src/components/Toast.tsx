import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { toastVariants } from '@/lib/motion'

interface Props {
  message: string | null
  icon?: string
  color?: string
  duration?: number
  onClose: () => void
}

export function Toast({ message, icon, color = 'var(--gold)', duration = 3000, onClose }: Props) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [message, duration, onClose])

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          className="toast-notification"
          variants={toastVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{ '--toast-color': color } as React.CSSProperties}
        >
          {icon && <span className="toast-icon">{icon}</span>}
          <span className="toast-message">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
