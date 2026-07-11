import { motion, AnimatePresence } from 'framer-motion'
import { useCurva } from '@/hooks/useCurva'
import { Lobby } from '@/components/Lobby'
import { Stand } from '@/components/Stand'

export default function App() {
  const { ready, room, identity, toast, eruption, bridgeMissing, send, showToast } = useCurva()

  if (!ready) {
    return (
      <div className="app-shell">
        <div className="boot">
          <div className="mark">C</div>
          <h1 className="display" style={{ fontSize: 56, margin: '8px 0 4px' }}>
            CURVA
          </h1>
          <p className="muted">Waking the swarm…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      {!room.joined ? (
        <>
          <header className="topbar">
            <div className="brand">
              <div className="mark sm">C</div>
              <div>
                <strong>CURVA</strong>
                <span className="muted tiny">P2P matchday stands · Pears stack</span>
              </div>
            </div>
            <div className="chip">
              <span className="dot" style={{ background: identity.color }} />
              {identity.name}
            </div>
          </header>
          {bridgeMissing ? (
            <div className="bridge-banner">
              UI preview mode — start with <b>npm run dev</b> in <code>apps/curva</code> for real Hyperswarm.
            </div>
          ) : null}
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
        </>
      ) : (
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
      )}

      <AnimatePresence>
        {toast ? (
          <motion.div
            className={`toast${toast.error ? ' error' : ''}`}
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
