import { FormEvent, useMemo, useState } from 'react'
import type { MatchPhase, RoomState } from '@/types/curva'
import { PulseWave } from './PulseWave'
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
  roar?: boolean
}> = [
  { kind: 'goal', label: 'GOAL', intensity: 5 },
  { kind: 'save', label: 'SAVE', intensity: 3 },
  { kind: 'foul', label: 'FOUL', intensity: 2 },
  { kind: 'card', label: 'CARD', intensity: 2 },
  { kind: 'roar', label: 'ROAR', intensity: 4, roar: true }
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
            <span className="muted tiny">{room.roomCode} · {room.matchMeta?.label || 'Matchday'}</span>
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
        <aside className="col glass side">
          <h3>The stand</h3>
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

          <div className="capsule" style={{ borderTop: '1px solid var(--line)', paddingTop: 12 }}>
            <h3 style={{ fontSize: 15 }}>Match Capsule</h3>
            <p className="muted tiny" style={{ margin: '4px 0 0' }}>
              Append-only Hypercore of this night · {room.historyCount} events
            </p>
            <code>{room.capsuleKey || '—'}</code>
            <button className="btn btn-ghost btn-sm" type="button" onClick={onCopyCapsule}>
              Copy key
            </button>
          </div>
        </aside>

        <section className="col center">
          <div className="glass scoreboard">
            <div className="team">{room.matchMeta?.home || 'Home'}</div>
            <div className="vs">VS</div>
            <div className="team">{room.matchMeta?.away || 'Away'}</div>
          </div>

          <div className="glass side energy-wrap">
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

          <div className="react-pad">
            {REACTIONS.map((r) => (
              <button
                key={r.kind}
                type="button"
                className={r.roar ? 'roar' : ''}
                onClick={() => {
                  onPulse(r.kind, r.intensity)
                  setBump((b) => b + 1)
                  playHit(r.kind === 'goal' || r.kind === 'roar' ? 'hard' : 'soft')
                }}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="glass side">
            <div className="energy-head">
              <h3>Chant Circles</h3>
              <span className="muted tiny">Join the same chant — erupt together</span>
            </div>
            <div className="chant-grid">
              {room.chantsCatalog.map((c) => {
                const live = room.chants.find((x) => x.id.startsWith(`${c.id}:`))
                return (
                  <button key={c.id} type="button" onClick={() => onChant(c.id)}>
                    {c.label}
                    <span>{live ? `${live.count} voices` : 'start / join'}</span>
                  </button>
                )
              })}
            </div>
            {eruption ? <div className="eruption">ERUPTION · {eruption}</div> : null}
          </div>
        </section>

        <aside className="col glass side">
          <h3>Prediction Seals</h3>
          <p className="muted tiny">One seal per curva · locked on your Hypercore</p>
          <form onSubmit={sealSubmit}>
            <label className="field">
              Winner
              <select value={winner} onChange={(e) => setWinner(e.target.value as typeof winner)}>
                <option value="home">Home</option>
                <option value="away">Away</option>
                <option value="draw">Draw</option>
              </select>
            </label>
            <div className="row2">
              <label className="field">
                Home
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={homeScore}
                  onChange={(e) => setHomeScore(Number(e.target.value))}
                />
              </label>
              <label className="field">
                Away
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
              First scorer (optional)
              <input value={scorer} maxLength={40} onChange={(e) => setScorer(e.target.value)} />
            </label>
            <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>
              Seal prediction
            </button>
          </form>

          <ul className="side-list" style={{ marginTop: 12 }}>
            {room.seals.length === 0 ? (
              <li className="muted">No seals yet — lock your pick before the roar.</li>
            ) : (
              room.seals.map((s) => (
                <li key={`${s.peerId}-${s.sealedAt}`}>
                  <span className="dot" style={{ background: s.color }} />
                  <div>
                    <strong>{s.name}</strong>
                    <div className="muted tiny">
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
