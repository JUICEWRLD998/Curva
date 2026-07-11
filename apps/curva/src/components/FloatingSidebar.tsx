import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './FloatingSidebar.css'

interface Props {
  isOpen: boolean
  onClose: () => void
  side: 'left' | 'right'
  title: string
  children: ReactNode
}

export function FloatingSidebar({ isOpen, onClose, side, title, children }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            className="sidebar-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Floating Sidebar Panel */}
          <motion.aside
            className={`floating-sidebar floating-sidebar-${side}`}
            initial={{ 
              x: side === 'left' ? -320 : 320,
              opacity: 0 
            }}
            animate={{ 
              x: 0,
              opacity: 1 
            }}
            exit={{ 
              x: side === 'left' ? -320 : 320,
              opacity: 0 
            }}
            transition={{ 
              type: 'spring',
              stiffness: 300,
              damping: 30
            }}
          >
            {/* Sidebar Header */}
            <div className="sidebar-header">
              <h3>{title}</h3>
              <button 
                type="button"
                className="sidebar-close"
                onClick={onClose}
                aria-label="Close sidebar"
              >
                ✕
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="sidebar-content">
              {children}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
