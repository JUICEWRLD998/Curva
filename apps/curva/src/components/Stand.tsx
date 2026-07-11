import { FormEvent, useMemo, useState } from 'react'
import type { MatchPhase, RoomState } from '@/types/curva'
import { PulseWave } from './PulseWave'
import { PulseButton } from './PulseButton'
import { RoarButton } from './RoarButton'
import { ChantGrid } from './ChantGrid'
import { FloatingSidebar } from './FloatingSidebar'
import { Scoreboard } from './Scoreboard'
import { playHit } from '@/lib/audio'

interface Props {
  room: RoomState
  eruption: string | null
  onLeave: () => void
  onPulse: (kind: string, intensity: number) => void
  onChant: (id: string) => void
  onPhase: (phase: MatchPhase) => void
  onSeal: (pick: {
    winner: 'home' | 'away' | 'draw'
    homeScore: number
    awayScore: number
    scorer: string
  }) => void
  onCopyCapsule: () => void
}

const REACTIONS: Array<{
  kind: string
  label: string
  intensity: number
  icon: string
  energyCost: number
  roar?: boolean
}> = [
  { kind: 'goal', label: 'GOAL', intensity: 5, icon: '⚽', energyCost: 30 },
  { kind: 'save', label: 'SAVE', intensity: 3, icon: '🧤', energyCost: 20 },
  { kind: 'foul', label: 'FOUL', intensity: 2, icon: '🚨', energyCost: 15 },
  { kind: 'card', label: 'CARD', intensity: 2, icon: '🟨', energyCost: 15 },
  { kind: 'roar', label: 'ROAR', intensity: 4, icon: '⚡', energyCost: 40, roar: true }
]

export function Stand({
  room,
  eruption,
  onLeave,
  onPulse,
  onChant,
  onPhase,
  onSeal,
  onCopyCapsule
}: Props) {
  const [winner, setWinner] = useState<'home' | 'away' | 'draw'>('home')
  const [homeScore, setHomeScore] = useState(2)
  const [awayScore, setAwayScore] = useState(1)
  const [scorer, setScorer] = useState('')
  const [bump, setBump] = useState(0)
  
  // Floating sidebar states
  const [isPeersOpen, setIsPeersOpen] = useState(false)
  const [isSealsOpen, setIsSealsOpen] = useState(false)

  const title = useMemo(
    () => `${room.matchMeta?.home || 'Home'} vs ${room.matchMeta?.away || 'Away'}`,
    [room.matchMeta]
  )

  const sealSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSeal({ winner, homeScore, awayScore, scorer: scorer.trim() })
  }

  return (
    <>
      <header className="topbar">
        <div className="brand">
          <div className="mark sm">C</div>
          <div>
            <strong>{title}</strong>
            <span className="text-muted">{room.roomCode} · {room.matchMeta?.label || 'Matchday'}</span>
          </div>
        </div>
        <div className="stand-meta">
          <div className="chip live-chip">
            <span className="dot" />
            {room.peerCount} in the curva
          </div>
          <button className="btn btn-ghost btn-sm" type="button" onClick={onLeave}>
            Leave
          </button>
        </div>
      </header>

      <div className="stand">
        {/* Full-Width Scoreboard - STADIUM SCALE */}
        <Scoreboard
          home={room.matchMeta?.home || 'Home'}
          away={room.matchMeta?.away || 'Away'}
          homeScore={room.phase === 'prematch' ? undefined : 0}
          awayScore={room.phase === 'prematch' ? undefined : 0}
          phase={room.phase}
          possession={room.phase === 'live' ? { home: 55, away: 45 } : undefined}
          onPhaseChange={onPhase}
        />

        {/* Main Content Area - Centered */}
        <div className="stand-main">
          {/* Energy Visualization */}
          <div className="glass energy-wrap">
            <div className="energy-head">
              <h3>Crowd Pulse</h3>
              <span className="energy-num">{room.energy}</span>
            </div>
            <div className="energy-bar">
              <div className="energy-fill" style={{ width: `${room.energy}%` }} />
            </div>
            <PulseWave energy={room.energy} bump={bump} />
            <div className="pulse-feed">
              {[...room.pulses].slice(-8).reverse().map((p) => (
                <span
                  key={p.id}
                  className="pulse-chip"
                  style={{ borderColor: `${p.color}55`, color: p.color }}
                >
                  {p.name} · {(p.kind || 'roar').toUpperCase()}
                </span>
              ))}
            </div>
          </div>

          {/* Pulse Reaction Buttons */}
          <div className="pulse-grid">
            {REACTIONS.filter(r => !r.roar).map((r) => (
              <PulseButton
                key={r.kind}
                kind={r.kind}
                label={r.label}
                intensity={r.intensity}
                icon={r.icon}
                energyCost={r.energyCost}
                onClick={() => {
                  onPulse(r.kind, r.intensity)
                  setBump((b) => b + 1)
                  playHit(r.kind === 'goal' ? 'hard' : 'soft')
                }}
              />
            ))}
          </div>

          {/* ROAR Button - Hero Position */}
          <div className="roar-hero">
            <RoarButton
              onClick={() => {
                onPulse('roar', 4)
                setBump((b) => b + 1)
                playHit('hard')
              }}
            />
          </div>

          {/* Chant Circles */}
          <ChantGrid
            catalog={room.chantsCatalog}
            liveChants={room.chants}
            onChantClick={onChant}
          />

          {/* Floating Sidebar Triggers */}
          <div className="sidebar-triggers">
            <button 
              className="btn btn-ghost"
              onClick={() => setIsPeersOpen(true)}
              type="button"
            >
              👥 {room.peerCount} {room.peerCount === 1 ? 'Fan' : 'Fans'}
            </button>
            <button 
              className="btn btn-ghost"
              onClick={() => setIsSealsOpen(true)}
              type="button"
            >
              🔒 {room.seals.length} {room.seals.length === 1 ? 'Seal' : 'Seals'}
            </button>
            <button 
              className="btn btn-ghost" 
              onClick={onCopyCapsule}
              type="button"
            >
              📦 Capsule
            </button>
          </div>
        </div>
      </div>

      {/* Floating Sidebar - Peers & Capsule */}
      <FloatingSidebar
        isOpen={isPeersOpen}
        onClose={() => setIsPeersOpen(false)}
        side="left"
        title="The Stand"
      >
        <div className="sidebar-section">
          <h4>Fans in the Curva</h4>
          <p className="text-muted">
            {room.peerCount} {room.peerCount === 1 ? 'fan' : 'fans'} connected to the swarm
          </p>
        </div>

        <ul className="side-list">
          {room.peers.map((p) => (
            <li key={p.id}>
              <span className="dot" style={{ background: p.color }} />
              <span>
                {p.name}
                {p.self ? ' (you)' : ''}
              </span>
            </li>
          ))}
        </ul>

        <div className="sidebar-section" style={{ marginTop: 'auto', paddingTop: 'var(--space-5)', borderTop: '1px solid var(--line)' }}>
          <h4>Match Capsule</h4>
          <p className="text-muted">
            Append-only Hypercore · {room.historyCount} events recorded
          </p>
          {room.capsuleKey ? (
            <>
              <code style={{
                display: 'block',
                padding: 'var(--space-2)',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--pitch-950)',
                color: 'var(--gold)',
                fontSize: 'var(--text-xs)',
                wordBreak: 'break-all',
                maxHeight: '72px',
                overflow: 'auto',
                fontFamily: 'monospace'
              }}>
                {room.capsuleKey}
              </code>
              <button 
                className="btn btn-ghost btn-sm" 
                type="button" 
                onClick={onCopyCapsule}
                style={{ width: '100%', marginTop: 'var(--space-2)' }}
              >
                Copy Key
              </button>
            </>
          ) : (
            <p className="text-muted">No capsule key yet</p>
          )}
        </div>
      </FloatingSidebar>

      {/* Floating Sidebar - Seals */}
      <FloatingSidebar
        isOpen={isSealsOpen}
        onClose={() => setIsSealsOpen(false)}
        side="right"
        title="Prediction Seals"
      >
        <div className="sidebar-section">
          <h4>Lock Your Pick</h4>
          <p className="text-muted">
            One seal per curva · Stored on your Hypercore
          </p>
        </div>

        <form onSubmit={sealSubmit}>
          <label className="field">
            <span>Winner</span>
            <select value={winner} onChange={(e) => setWinner(e.target.value as typeof winner)}>
              <option value="home">{room.matchMeta?.home || 'Home'}</option>
              <option value="away">{room.matchMeta?.away || 'Away'}</option>
              <option value="draw">Draw</option>
            </select>
          </label>
          <div className="row2">
            <label className="field">
              <span>Home Score</span>
              <input
                type="number"
                min={0}
                max={20}
                value={homeScore}
                onChange={(e) => setHomeScore(Number(e.target.value))}
              />
            </label>
            <label className="field">
              <span>Away Score</span>
              <input
                type="number"
                min={0}
                max={20}
                value={awayScore}
                onChange={(e) => setAwayScore(Number(e.target.value))}
              />
            </label>
          </div>
          <label className="field">
            <span>First Scorer (optional)</span>
            <input 
              value={scorer} 
              maxLength={40} 
              onChange={(e) => setScorer(e.target.value)}
              placeholder="Player name"
            />
          </label>
          <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>
            Seal Prediction
          </button>
        </form>

        <div className="sidebar-section" style={{ marginTop: 'var(--space-5)', paddingTop: 'var(--space-5)', borderTop: '1px solid var(--line)' }}>
          <h4>Sealed Predictions</h4>
          {room.seals.length === 0 ? (
            <p className="text-muted">No seals yet — lock your pick before the roar.</p>
          ) : (
            <ul className="side-list">
              {room.seals.map((s) => (
                <li key={`${s.peerId}-${s.sealedAt}`}>
                  <span className="dot" style={{ background: s.color }} />
                  <div style={{ flex: 1 }}>
                    <strong>{s.name}</strong>
                    <div className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
                      {s.pick
                        ? `${s.pick.winner} · ${s.pick.homeScore}-${s.pick.awayScore}`
                        : s.commitment.slice(0, 10) + '…'}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </FloatingSidebar>

      {/* Eruption Overlay */}
      {eruption && (
        <div className="eruption">
          <div className="eruption-text">
            ERUPTION · {eruption}
          </div>
        </div>
      )}
    </>
  )
}
