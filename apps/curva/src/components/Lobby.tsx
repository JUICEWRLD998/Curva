import { FormEvent, useState } from 'react'
import type { Identity, MatchMeta } from '@/types/curva'

interface Props {
  identity: Identity
  onSaveProfile: (name: string, color: string) => void
  onCreate: (meta: MatchMeta) => void
  onJoin: (code: string) => void
}

export function Lobby({ identity, onSaveProfile, onCreate, onJoin }: Props) {
  const [name, setName] = useState(identity.name)
  const [color, setColor] = useState(identity.color || '#f5c518')
  const [home, setHome] = useState('Brazil')
  const [away, setAway] = useState('Germany')
  const [label, setLabel] = useState('World Stage · Group Night')
  const [code, setCode] = useState('')

  const saveProfile = (e: FormEvent) => {
    e.preventDefault()
    onSaveProfile(name.trim() || 'Fan', color)
  }

  const create = (e: FormEvent) => {
    e.preventDefault()
    onCreate({
      home: home.trim() || 'Home',
      away: away.trim() || 'Away',
      label: label.trim() || 'Matchday'
    })
  }

  const join = (e: FormEvent) => {
    e.preventDefault()
    onJoin(code.trim())
  }

  return (
    <div className="lobby">
      <section className="hero">
        <p className="eyebrow">Football · Peer to peer · Zero infrastructure</p>
        <h1>The stand has no server.</h1>
        <p>
          CURVA is a real P2P matchday product. Create a room, share a code, and become one organism when
          the ball hits the net — Hyperswarm pulse, chant circles, sealed predictions, immortal capsules.
        </p>

        <div className="glass pitch-card">
          <div className="pitch-lines" aria-hidden />
          <div className="copy">
            <p className="eyebrow">Built for the global tournament moment</p>
            <h2 className="display" style={{ margin: '8px 0 6px', fontSize: 28 }}>
              Feel the curva from anywhere on earth.
            </h2>
            <p className="muted" style={{ margin: 0, maxWidth: '42ch' }}>
              No Discord host. No cloud chat bill. Your room lives on the swarm — and the night can be seeded forever.
            </p>
            <div className="feature-grid">
              <div className="feature">
                <b>01 · PULSE</b>
                <span className="muted tiny">Crowd energy over Hyperswarm</span>
              </div>
              <div className="feature">
                <b>02 · CHANTS</b>
                <span className="muted tiny">Erupt when voices align</span>
              </div>
              <div className="feature">
                <b>03 · SEALS</b>
                <span className="muted tiny">Picks locked on Hypercore</span>
              </div>
              <div className="feature">
                <b>04 · CAPSULE</b>
                <span className="muted tiny">Append-only match memory</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <aside className="stack">
        <form className="glass panel" onSubmit={saveProfile}>
          <h3>Your kit</h3>
          <label className="field">
            Display name
            <input value={name} maxLength={24} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="field">
            Color
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </label>
          <button className="btn btn-ghost" type="submit">
            Save kit
          </button>
        </form>

        <form className="glass panel accent" onSubmit={create}>
          <h3>Open a curva</h3>
          <div className="row2">
            <label className="field">
              Home
              <input value={home} maxLength={28} onChange={(e) => setHome(e.target.value)} />
            </label>
            <label className="field">
              Away
              <input value={away} maxLength={28} onChange={(e) => setAway(e.target.value)} />
            </label>
          </div>
          <label className="field">
            Fixture label
            <input value={label} maxLength={48} onChange={(e) => setLabel(e.target.value)} />
          </label>
          <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>
            Create room code
          </button>
        </form>

        <form className="glass panel" onSubmit={join}>
          <h3>Join a curva</h3>
          <label className="field">
            Room code
            <input
              value={code}
              placeholder="CV-XXXXXX"
              maxLength={16}
              autoComplete="off"
              onChange={(e) => setCode(e.target.value.toUpperCase())}
            />
          </label>
          <button className="btn btn-mint" type="submit" style={{ width: '100%' }}>
            Enter the stand
          </button>
        </form>
      </aside>
    </div>
  )
}
