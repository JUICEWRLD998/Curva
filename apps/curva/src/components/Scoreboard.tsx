import { motion } from 'framer-motion'
import type { MatchPhase } from '@/types/curva'
import './Scoreboard.css'

interface Props {
  home: string
  away: string
  homeScore?: number
  awayScore?: number
  phase: MatchPhase
  possession?: {
    home: number
    away: number
  }
  onPhaseChange?: (phase: MatchPhase) => void
}

export function Scoreboard({ 
  home, 
  away, 
  homeScore, 
  awayScore, 
  phase,
  possession,
  onPhaseChange 
}: Props) {
  const showScores = phase === 'live' || phase === 'fulltime'
  
  return (
    <div className="scoreboard-container">
      <div className="glass scoreboard">
        {/* Team Names and Scores */}
        <div className="scoreboard-main">
          <div className="team-section">
            <span className="team-name">{home}</span>
            {showScores && homeScore !== undefined && (
              <motion.span 
                className="team-score"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {homeScore}
              </motion.span>
            )}
          </div>

          <div className="vs-divider">
            {phase === 'live' ? (
              <motion.span 
                className="live-indicator"
                animate={{ 
                  opacity: [1, 0.5, 1],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                LIVE
              </motion.span>
            ) : (
              <span className="vs-text">VS</span>
            )}
          </div>

          <div className="team-section">
            {showScores && awayScore !== undefined && (
              <motion.span 
                className="team-score"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {awayScore}
              </motion.span>
            )}
            <span className="team-name">{away}</span>
          </div>
        </div>

        {/* Possession Bars */}
        {possession && phase === 'live' && (
          <motion.div 
            className="possession-bars"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="possession-bar">
              <div 
                className="possession-fill possession-home" 
                style={{ width: `${possession.home}%` }}
              />
            </div>
            <span className="possession-label">
              {possession.home}% · POSSESSION · {possession.away}%
            </span>
            <div className="possession-bar">
              <div 
                className="possession-fill possession-away" 
                style={{ width: `${possession.away}%` }}
              />
            </div>
          </motion.div>
        )}

        {/* Phase Selector Pills */}
        {onPhaseChange && (
          <div className="phase-selector">
            {(['prematch', 'live', 'fulltime'] as MatchPhase[]).map((p) => (
              <button
                key={p}
                type="button"
                className={`phase-pill ${phase === p ? 'active' : ''}`}
                onClick={() => onPhaseChange(p)}
              >
                {p === 'prematch' ? 'Prematch' : p === 'live' ? 'Live' : 'Full Time'}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
