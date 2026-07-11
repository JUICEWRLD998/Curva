import { motion, AnimatePresence } from 'framer-motion'
import { useCurvax } from '@/hooks/useCurvax'
import { Lobby } from '@/components/Lobby'
import { Stand } from '@/components/Stand'

export default function App() {
  const { ready, room, identity, toast, eruption, bridgeMissing, send, showToast } = useCurvax()

  if (!ready) {
    return (
      <div className="app-shell">
        <div className="boot">
          <div className="mark">C</div>
          <h1 className="display" style={{ fontSize: 56, margin: '8px 0 4px' }}>
            CURVAX
          </h1>
          <p className="muted">Waking the swarm…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      {/* Skip to main content link for keyboard navigation (WCAG 2.4.1) */}
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>
      
      {!room.joined ? (
        <>
          <header className="topbar" role="banner">
            <div className="brand">
              <div className="mark sm">C</div>
              <div>
                <strong>CURVAX</strong>
                <span className="muted tiny">P2P matchday stands · Pears stack</span>
              </div>
            </div>
            <div className="chip">
              <span className="dot" style={{ background: identity.color }} />
              {identity.name}
            </div>
          </header>
          {bridgeMissing ? (
            <div className="bridge-banner" role="alert">
              UI preview mode — start with <b>npm run dev</b> in <code>apps/curvax</code> for real Hyperswarm.
            </div>
          ) : null}
          <main id="main-content" role="main">
            <Lobby
              identity={identity}
              onSaveProfile={(name, color) => void send({ type: 'profile', name, color })}
              onCreate={(matchMeta) => void send({ type: 'create-room', matchMeta })}
              onJoin={(roomCode) => {
                if (!roomCode) {
                  showToast('Enter a room code', true)
                  return
                }
                void send({ type: 'join-room', roomCode })
              }}
            />
          </main>
        </>
      ) : (
        <main id="main-content" role="main">
          <Stand
            room={room}
            eruption={eruption}
            onLeave={() => void send({ type: 'leave-room' })}
            onPulse={(kind, intensity) => void send({ type: 'pulse', kind, intensity })}
            onChant={(chantId) => void send({ type: 'chant', chantId })}
            onPhase={(phase) => void send({ type: 'set-phase', phase })}
            onSeal={(pick) => void send({ type: 'seal', pick })}
            onCopyCapsule={async () => {
              const key = room.capsuleKey
              if (!key) {
                showToast('No capsule yet', true)
                return
              }
              try {
                await navigator.clipboard.writeText(key)
                showToast('Capsule key copied')
              } catch {
                showToast(key)
              }
            }}
          />
        </main>
      )}

      <AnimatePresence>
        {toast ? (
          <motion.div
            className={`toast${toast.error ? ' error' : ''}`}
            role="status"
            aria-live="polite"
            aria-atomic="true"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            {toast.message}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
