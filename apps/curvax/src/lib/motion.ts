/**
 * Motion & Animation Configurations
 * Centralized spring configs and animation variants
 */

// Spring Configurations
export const springConfigs = {
  gentle: { type: 'spring' as const, stiffness: 120, damping: 14 },
  snappy: { type: 'spring' as const, stiffness: 300, damping: 20 },
  bouncy: { type: 'spring' as const, stiffness: 400, damping: 10 },
}

// Button Animations
export const buttonVariants = {
  hover: {
    scale: 1.02,
    y: -4,
    transition: springConfigs.snappy,
  },
  tap: {
    scale: 0.94,
    transition: springConfigs.snappy,
  },
}

// Card Animations
export const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      ...springConfigs.snappy,
      delay: i * 0.1,
    },
  }),
  hover: {
    y: -2,
    scale: 1.02,
    transition: springConfigs.gentle,
  },
}

// Lobby Entrance Animations
export const lobbyAnimations = {
  background: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  },
  hero: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { ...springConfigs.bouncy, duration: 0.5 },
  },
  pitchCard: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { ...springConfigs.gentle, delay: 0.2 },
  },
}

// Stand Entrance Animations
export const standAnimations = {
  scoreboard: {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    transition: { ...springConfigs.bouncy, duration: 0.4 },
  },
  waveform: {
    initial: { opacity: 0, scaleY: 0 },
    animate: { opacity: 1, scaleY: 1 },
    transition: { ...springConfigs.bouncy, duration: 0.6, delay: 0.2 },
  },
  actionButtons: {
    initial: { opacity: 0, scale: 0.8 },
    animate: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        ...springConfigs.bouncy,
        delay: 0.3 + i * 0.1,
      },
    }),
  },
  sidebar: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { ...springConfigs.gentle, duration: 0.5, delay: 0.5 },
  },
}

// Pulse Event Animations
export const pulseEventVariants = {
  initial: { 
    scale: 0, 
    opacity: 0,
  },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: springConfigs.bouncy,
  },
  exit: { 
    scale: 1.2, 
    opacity: 0,
    transition: { duration: 0.3 },
  },
}

// Toast Animations
export const toastVariants = {
  initial: { 
    opacity: 0, 
    y: 50,
    scale: 0.8,
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: springConfigs.bouncy,
  },
  exit: { 
    opacity: 0, 
    y: -20,
    scale: 0.9,
    transition: { duration: 0.2 },
  },
}

// Energy Change Animation
export const energyChangeVariants = {
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 0.4,
      ease: 'easeInOut',
    },
  },
}

// Peer Join Celebration
export const peerJoinVariants = {
  initial: { scale: 0, rotate: -180 },
  animate: { 
    scale: [0, 1.2, 1],
    rotate: [0, 10, 0],
    transition: {
      ...springConfigs.bouncy,
      duration: 0.6,
    },
  },
}

// Haptic Feedback (if available)
export const triggerHaptic = (style: 'light' | 'medium' | 'heavy' = 'medium') => {
  if ('vibrate' in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30],
    }
    navigator.vibrate(patterns[style])
  }
}

// Screen Shake Helper
export const triggerScreenShake = (intensity: 'light' | 'medium' | 'heavy' = 'medium') => {
  const classes = {
    light: 'screen-shake-light',
    medium: 'screen-shake',
    heavy: 'screen-shake-heavy',
  }
  
  const className = classes[intensity]
  document.body.classList.add(className)
  
  const duration = intensity === 'light' ? 300 : intensity === 'medium' ? 500 : 700
  setTimeout(() => document.body.classList.remove(className), duration)
}
