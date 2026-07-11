import { FormEvent, useState } from 'react'
import { motion } from 'framer-motion'
import type { Identity, MatchMeta } from '@/types/curva'
import { lobbyAnimations, cardVariants } from '@/lib/motion'

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
    <motion.div 
      className="lobby"
      {...lobbyAnimations.background}
    >
      {/* Hero Section - Centered, Stadium-Scale */}
      <motion.section 
        className="hero"
        {...lobbyAnimations.hero}
      >
        <p className="eyebrow">Peer-to-peer · Zero servers · Pure football</p>
        <h1>The stand has no server.</h1>
        <p>
          Create a room, share a code, become one organism when the ball hits the net. 
          Hyperswarm pulse reactions, coordinated chants, sealed predictions, immortal match capsules.
        </p>
      </motion.section>

      {/* Pitch Visualization - Stadium Feature Card */}
      <motion.div 
        className="glass pitch-card"
        {...lobbyAnimations.pitchCard}
      >
        <div className="pitch-lines" aria-hidden="true" />
        <div className="copy">
          <p className="eyebrow">Built for the tournament moment</p>
          <h2>Feel the curva from anywhere.</h2>
          <div className="feature-grid">
            <div className="feature">
              <b>PULSE</b>
              <span className="text-muted">Crowd energy over Hyperswarm</span>
            </div>
            <div className="feature">
              <b>CHANTS</b>
              <span className="text-muted">Erupt when voices align</span>
            </div>
            <div className="feature">
              <b>SEALS</b>
              <span className="text-muted">Picks locked on Hypercore</span>
            </div>
            <div className="feature">
              <b>CAPSULE</b>
              <span className="text-muted">Append-only match memory</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Cards - Horizontal Flow with Visual Hierarchy */}
      <div className="action-cards">
        {/* Create Room Card - PRIMARY ACTION */}
        <motion.form 
          className="glass panel panel-primary" 
          onSubmit={create}
          custom={0}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <div className="panel-badge">Primary</div>
          <h3>Open a Curva</h3>
          <p className="panel-desc">Host a new room on the Hyperswarm</p>
          
          <div className="row2">
            <label className="field">
              <span>Home Team</span>
              <input 
                value={home} 
                maxLength={28} 
                onChange={(e) => setHome(e.target.value)}
                placeholder="Brazil"
              />
            </label>
            <label className="field">
              <span>Away Team</span>
              <input 
                value={away} 
                maxLength={28} 
                onChange={(e) => setAway(e.target.value)}
                placeholder="Germany"
              />
            </label>
          </div>
          
          <label className="field">
            <span>Match Label</span>
            <input 
              value={label} 
              maxLength={48} 
              onChange={(e) => setLabel(e.target.value)}
              placeholder="World Stage · Group Night"
            />
          </label>
          
          <button className="btn btn-primary btn-lg" type="submit">
            Create Room Code
          </button>
        </motion.form>

        {/* Join Room Card - SECONDARY ACTION */}
        <motion.form 
          className="glass panel panel-secondary" 
          onSubmit={join}
          custom={1}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <div className="panel-badge">Join</div>
          <h3>Enter the Stand</h3>
          <p className="panel-desc">Connect to an existing curva</p>
          
          <label className="field">
            <span>Room Code</span>
            <input
              value={code}
              placeholder="CV-XXXXXX"
              maxLength={16}
              autoComplete="off"
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              style={{ 
                fontFamily: 'var(--font-data)',
                fontSize: 'var(--text-heading)',
                textAlign: 'center',
                letterSpacing: 'var(--tracking-wider)'
              }}
            />
          </label>
          
          <button className="btn btn-mint btn-lg" type="submit">
            Join Room
          </button>
        </motion.form>

        {/* Profile Card - TERTIARY ACTION */}
        <motion.form 
          className="glass panel panel-tertiary" 
          onSubmit={saveProfile}
          custom={2}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <div className="panel-badge">Profile</div>
          <h3>Your Kit</h3>
          <p className="panel-desc">Identity shown to peers</p>
          
          <label className="field">
            <span>Display Name</span>
            <input 
              value={name} 
              maxLength={24} 
              onChange={(e) => setName(e.target.value)}
              placeholder="Fan Name"
            />
          </label>
          
          <label className="field">
            <span>Fan Color</span>
            <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
              <input 
                type="color" 
                value={color} 
                onChange={(e) => setColor(e.target.value)}
                style={{ 
                  width: '64px', 
                  height: '44px', 
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer'
                }}
              />
              <input 
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#f5c518"
                maxLength={7}
                style={{ 
                  flex: 1,
                  fontFamily: 'monospace',
                  textTransform: 'uppercase'
                }}
              />
            </div>
          </label>
          
          <button className="btn btn-ghost" type="submit">
            Save Kit
          </button>
        </motion.form>
      </div>
    </motion.div>
  )
}
