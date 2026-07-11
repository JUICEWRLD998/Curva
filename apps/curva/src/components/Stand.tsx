import { FormEvent, useMemo, useState } from 'react'
import type { MatchPhase, RoomState } from '@/types/curva'
import { PulseWave } from './PulseWave'
import { PulseButton } from './PulseButton'
import { RoarButton } from './RoarButton'
import { ChantGrid } from './ChantGrid'
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
  roar?: boolean
}> = [
  { kind: 'goal', label: 'GOAL', intensity: 5, icon: '⚽' },
  { kind: 'save', label: 'SAVE', intensity: 3, icon: '🧤' },
  { kind: 'foul', label: 'FOUL', intensity: 2, icon: '🚨' },
  { kind: 'card', label: 'CARD', intensity: 2, icon: '🟨' },
  { kind: 'roar', label: 'ROAR', intensity: 4, icon: '⚡', roar: true }
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
          <div className="phase-pills">
            {(['prematch', 'live', 'fulltime'] as MatchPhase[]).map((p) => (
              <button
                key={p}
                type="button"
                className={room.phase === p ? 'active' : ''}
                onClick={() => onPhase(p)}
              >
                {p === 'prematch' ? 'Prematch' : p === 'live' ? 'Live' : 'Full time'}
              </button>
            ))}
          </div>
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
        {/* Full-Width Scoreboard */}
        <div className="glass scoreboard">
          <div className="team">{room.matchMeta?.home || 'Home'}</div>
          <div className="vs">VS</div>
          <div className="team">{room.matchMeta?.away || 'Away'}</div>
        </div>

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
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className="btn btn-ghost">
              👥 {room.peerCount} Fans
            </button>
            <button className="btn btn-ghost">
              🔒 {room.seals.length} Seals
            </button>
            <button className="btn btn-ghost" onClick={onCopyCapsule}>
              📦 Capsule
            </button>
          </div>
        </div>
      </div>

      {/* Eruption Overlay */}
      {eruption && (
        <div className="eruption">
          <div className="eruption-text">
            ERUPTION · {eruption}
          </div>
        </div>
      )}

      {/* TODO: Floating Sidebars - Will be added in next task */}
      {/* Hidden for now - accessible via triggers */}
      <div style={{ display: 'none' }}>
        <aside className="glass side">
          <h3>The Stand</h3>
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

          <div className="capsule">
            <h3>Match Capsule</h3>
            <p className="text-muted">
              Append-only Hypercore of this night · {room.historyCount} events
            </p>
            <code>{room.capsuleKey || '—'}</code>
            <button className="btn btn-ghost btn-sm" type="button" onClick={onCopyCapsule}>
              Copy key
            </button>
          </div>
        </aside>

        <aside className="glass side">
          <h3>Prediction Seals</h3>
          <p className="text-muted">One seal per curva · locked on your Hypercore</p>
          <form onSubmit={sealSubmit}>
            <label className="field">
              <span>Winner</span>
              <select value={winner} onChange={(e) => setWinner(e.target.value as typeof winner)}>
                <option value="home">Home</option>
                <option value="away">Away</option>
                <option value="draw">Draw</option>
              </select>
            </label>
            <div className="row2">
              <label className="field">
                <span>Home</span>
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={homeScore}
                  onChange={(e) => setHomeScore(Number(e.target.value))}
                />
              </label>
              <label className="field">
                <span>Away</span>
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
              <span>First scorer (optional)</span>
              <input value={scorer} maxLength={40} onChange={(e) => setScorer(e.target.value)} />
            </label>
            <button className="btn btn-primary" type="submit">
              Seal Prediction
            </button>
          </form>

          <ul className="side-list">
            {room.seals.length === 0 ? (
              <li className="text-muted">No seals yet — lock your pick before the roar.</li>
            ) : (
              room.seals.map((s) => (
                <li key={`${s.peerId}-${s.sealedAt}`}>
                  <span className="dot" style={{ background: s.color }} />
                  <div>
                    <strong>{s.name}</strong>
                    <div className="text-muted">
                      {s.pick
                        ? `${s.pick.winner} · ${s.pick.homeScore}-${s.pick.awayScore}`
                        : s.commitment.slice(0, 10) + '…'}
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </aside>
      </div>
    </>
  )
}
