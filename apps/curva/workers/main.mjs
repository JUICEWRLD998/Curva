/**
 * CURVA Bare worker — Pears networking & storage only.
 * Hyperswarm · Corestore · Hypercore
 * (Bare requires ESM JS here — intentional exception to TS UI stack.)
 */
import Hyperswarm from 'hyperswarm'
import Corestore from 'corestore'
import b4a from 'b4a'
import crypto from 'hypercore-crypto'

const storePath = Bare.argv[2] || './curva-data'
const store = new Corestore(storePath)
const swarm = new Hyperswarm()

const peers = new Map()
let identityCore = null
let sealsCore = null
let capsuleCore = null

let roomCode = null
let roomTopic = null
let joined = false
let matchMeta = null
let phase = 'prematch'

const identity = { id: null, name: 'Fan', color: '#f5c518' }

const room = {
  peers: new Map(),
  pulses: [],
  chants: new Map(),
  seals: new Map(),
  energy: 0,
  history: []
}

const CHANTS = [
  { id: 'ole', label: 'OLÉ OLÉ' },
  { id: 'defense', label: 'DEFENSE' },
  { id: 'letsgo', label: "LET'S GO" },
  { id: 'siu', label: 'SIUUU' },
  { id: 'glory', label: 'GLORY' },
  { id: 'believe', label: 'BELIEVE' }
]

function emit(msg) {
  Bare.IPC.write(JSON.stringify(msg))
}

function shortId(buf) {
  return b4a.toString(buf, 'hex').slice(0, 8)
}

function roomTopicFromCode(code) {
  const normalized = String(code).trim().toUpperCase().replace(/[^A-Z0-9-]/g, '')
  return crypto.hash(b4a.from('curva:v1:room:' + normalized))
}

function randomRoomCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let out = 'CV-'
  for (let i = 0; i < 6; i++) out += alphabet[(Math.random() * alphabet.length) | 0]
  return out
}

function randomColor() {
  const palette = ['#f5c518', '#3dff9a', '#5b9dff', '#ff5d6c', '#c084fc', '#f472b6', '#34d399']
  return palette[(Math.random() * palette.length) | 0]
}

function now() {
  return Date.now()
}

function pushHistory(event) {
  room.history.push(event)
  if (room.history.length > 2000) room.history.shift()
  appendCapsule(event).catch(() => {})
}

async function appendCapsule(event) {
  if (!capsuleCore) return
  await capsuleCore.append(b4a.from(JSON.stringify(event)))
}

function recomputeEnergy() {
  const cutoff = now() - 12000
  let sum = 0
  for (const p of room.pulses) {
    if (p.t >= cutoff) sum += p.intensity || 1
  }
  room.energy = Math.min(100, Math.round(sum * 4))
}

function snapshot() {
  return {
    type: 'state',
    identity,
    roomCode,
    joined,
    phase,
    matchMeta,
    energy: room.energy,
    peers: [...room.peers.values()],
    peerCount: room.peers.size,
    pulses: room.pulses.slice(-40),
    chants: [...room.chants.values()].map((c) => ({
      id: c.id,
      label: c.label,
      starter: c.starter,
      count: c.joined.size,
      joined: [...c.joined],
      startedAt: c.startedAt
    })),
    seals: [...room.seals.values()],
    chantsCatalog: CHANTS,
    capsuleKey: capsuleCore ? b4a.toString(capsuleCore.key, 'hex') : null,
    historyCount: room.history.length
  }
}

function broadcast(obj) {
  const payload = b4a.from(JSON.stringify(obj))
  for (const { conn } of peers.values()) {
    try {
      conn.write(payload)
    } catch {}
  }
}

function sendTo(conn, obj) {
  try {
    conn.write(b4a.from(JSON.stringify(obj)))
  } catch {}
}

function registerLocalPeer() {
  room.peers.set(identity.id, {
    id: identity.id,
    name: identity.name,
    color: identity.color,
    lastSeen: now(),
    self: true
  })
}

function mergePulse(p) {
  if (!p || !p.id) return
  if (room.pulses.some((x) => x.id === p.id)) return
  room.pulses.push(p)
  const cutoff = now() - 30000
  room.pulses = room.pulses.filter((x) => x.t >= cutoff)
}

function applyChant(c) {
  if (!c || !c.id) return
  let entry = room.chants.get(c.id)
  if (!entry) {
    entry = {
      id: c.id,
      label: c.label || c.id,
      starter: c.starter,
      joined: new Set(),
      startedAt: c.startedAt || now()
    }
    room.chants.set(c.id, entry)
  }
  if (c.peerId) entry.joined.add(c.peerId)
  for (const [id, ch] of room.chants) {
    if (now() - ch.startedAt > 45000) room.chants.delete(id)
  }
  pushHistory({ kind: 'chant', id: c.id, peerId: c.peerId, t: now() })
}

function handlePeerMessage(conn, raw) {
  let msg
  try {
    msg = JSON.parse(b4a.toString(raw))
  } catch {
    return
  }

  switch (msg.type) {
    case 'hello': {
      room.peers.set(msg.identity.id, {
        id: msg.identity.id,
        name: msg.identity.name,
        color: msg.identity.color,
        lastSeen: now(),
        self: false
      })
      sendTo(conn, { type: 'hello', identity, phase, matchMeta })
      sendTo(conn, {
        type: 'sync',
        phase,
        matchMeta,
        pulses: room.pulses.slice(-20),
        seals: [...room.seals.values()],
        chants: [...room.chants.values()].map((c) => ({
          id: c.id,
          label: c.label,
          starter: c.starter,
          joined: [...c.joined],
          startedAt: c.startedAt
        }))
      })
      emit(snapshot())
      break
    }
    case 'sync': {
      if (msg.phase) phase = msg.phase
      if (msg.matchMeta) matchMeta = msg.matchMeta
      if (Array.isArray(msg.pulses)) for (const p of msg.pulses) mergePulse(p)
      if (Array.isArray(msg.seals)) {
        for (const s of msg.seals) room.seals.set(s.peerId + ':' + s.sealedAt, s)
      }
      if (Array.isArray(msg.chants)) {
        for (const c of msg.chants) {
          const existing = room.chants.get(c.id) || {
            id: c.id,
            label: c.label,
            starter: c.starter,
            joined: new Set(),
            startedAt: c.startedAt
          }
          for (const j of c.joined || []) existing.joined.add(j)
          room.chants.set(c.id, existing)
        }
      }
      recomputeEnergy()
      emit(snapshot())
      break
    }
    case 'pulse': {
      mergePulse(msg.pulse)
      recomputeEnergy()
      pushHistory({ kind: 'pulse', ...msg.pulse })
      emit({ type: 'pulse', pulse: msg.pulse, energy: room.energy })
      emit(snapshot())
      break
    }
    case 'chant': {
      applyChant(msg.chant)
      emit(snapshot())
      break
    }
    case 'seal': {
      room.seals.set(msg.seal.peerId + ':' + msg.seal.sealedAt, msg.seal)
      pushHistory({ kind: 'seal', ...msg.seal })
      emit(snapshot())
      break
    }
    case 'phase': {
      phase = msg.phase
      if (msg.matchMeta) matchMeta = msg.matchMeta
      pushHistory({ kind: 'phase', phase, t: now() })
      emit(snapshot())
      break
    }
    case 'match-meta': {
      matchMeta = msg.matchMeta
      emit(snapshot())
      break
    }
    default:
      break
  }
}

swarm.on('connection', (conn) => {
  const peerId = shortId(conn.remotePublicKey)
  peers.set(peerId, { conn })
  sendTo(conn, { type: 'hello', identity, phase, matchMeta })

  conn.on('data', (data) => handlePeerMessage(conn, data))
  conn.on('error', () => {})
  conn.once('close', () => {
    peers.delete(peerId)
    emit(snapshot())
  })

  emit({ type: 'peer-connected', peerId, count: peers.size })
  emit(snapshot())
})

async function initStorage() {
  identityCore = store.get({ name: 'curva-identity' })
  await identityCore.ready()
  sealsCore = store.get({ name: 'curva-seals' })
  await sealsCore.ready()

  if (identityCore.length === 0) {
    identity.id = shortId(identityCore.key)
    identity.name = 'Fan-' + identity.id.slice(0, 4).toUpperCase()
    identity.color = randomColor()
    await identityCore.append(
      b4a.from(JSON.stringify({ ...identity, createdAt: now() }))
    )
  } else {
    const last = await identityCore.get(identityCore.length - 1)
    const data = JSON.parse(b4a.toString(last))
    identity.id = data.id
    identity.name = data.name
    identity.color = data.color
  }

  for (let i = 0; i < sealsCore.length; i++) {
    try {
      const row = JSON.parse(b4a.toString(await sealsCore.get(i)))
      room.seals.set(row.peerId + ':' + row.sealedAt, row)
    } catch {}
  }

  registerLocalPeer()
  emit({ type: 'ready', identity })
  emit(snapshot())
}

async function joinRoom(code, meta = null) {
  const normalized = String(code).trim().toUpperCase()
  if (!normalized) {
    emit({ type: 'error', message: 'Room code required' })
    return
  }

  if (joined && roomTopic) {
    try {
      await swarm.leave(roomTopic)
    } catch {}
  }

  roomCode = normalized
  roomTopic = roomTopicFromCode(normalized)
  matchMeta = meta ||
    matchMeta || {
      home: 'Home',
      away: 'Away',
      label: 'Matchday',
      kickoff: null
    }
  phase = 'prematch'
  room.pulses = []
  room.chants.clear()
  room.energy = 0
  room.history = []
  room.peers.clear()
  registerLocalPeer()

  capsuleCore = store.get({ name: 'capsule-' + normalized })
  await capsuleCore.ready()

  await swarm.join(roomTopic, { client: true, server: true }).flushed()
  joined = true

  pushHistory({ kind: 'join', peerId: identity.id, roomCode, t: now(), matchMeta })
  emit({ type: 'joined', roomCode, topic: b4a.toString(roomTopic, 'hex') })
  emit(snapshot())
}

async function createRoom(meta) {
  await joinRoom(randomRoomCode(), meta)
}

async function updateProfile({ name, color }) {
  if (name) identity.name = String(name).slice(0, 24)
  if (color) identity.color = color
  registerLocalPeer()
  await identityCore.append(
    b4a.from(JSON.stringify({ ...identity, updatedAt: now() }))
  )
  broadcast({ type: 'hello', identity, phase, matchMeta })
  emit(snapshot())
}

function firePulse({ kind = 'roar', intensity = 1 }) {
  if (!joined) {
    emit({ type: 'error', message: 'Join a curva first' })
    return
  }
  const pulse = {
    id: identity.id + '-' + now() + '-' + Math.random().toString(16).slice(2, 6),
    peerId: identity.id,
    name: identity.name,
    color: identity.color,
    kind,
    intensity: Math.max(1, Math.min(5, Number(intensity) || 1)),
    t: now()
  }
  mergePulse(pulse)
  recomputeEnergy()
  pushHistory({ kind: 'pulse', ...pulse })
  broadcast({ type: 'pulse', pulse })
  emit({ type: 'pulse', pulse, energy: room.energy })
  emit(snapshot())
}

function fireChant(chantId) {
  if (!joined) {
    emit({ type: 'error', message: 'Join a curva first' })
    return
  }
  const catalog = CHANTS.find((c) => c.id === chantId) || { id: chantId, label: chantId }
  const instanceId = catalog.id + ':' + Math.floor(now() / 20000)
  const chant = {
    id: instanceId,
    label: catalog.label,
    starter: identity.id,
    peerId: identity.id,
    startedAt: now()
  }
  applyChant(chant)
  broadcast({ type: 'chant', chant })
  emit(snapshot())

  const entry = room.chants.get(instanceId)
  if (entry && entry.joined.size >= Math.max(2, Math.ceil(room.peers.size * 0.4))) {
    emit({
      type: 'eruption',
      chant: { id: instanceId, label: catalog.label, count: entry.joined.size }
    })
  }
}

async function sealPrediction(pick) {
  if (!joined) {
    emit({ type: 'error', message: 'Join a curva first' })
    return
  }
  if (phase === 'fulltime') {
    emit({ type: 'error', message: 'Match is over — cannot seal' })
    return
  }

  for (const s of room.seals.values()) {
    if (s.peerId === identity.id && s.roomCode === roomCode && !s.void) {
      emit({ type: 'error', message: 'You already sealed a prediction for this curva' })
      return
    }
  }

  const sealedAt = now()
  const openPick = {
    winner: pick.winner,
    homeScore: Number(pick.homeScore) || 0,
    awayScore: Number(pick.awayScore) || 0,
    scorer: (pick.scorer || '').slice(0, 40)
  }

  const commitment = b4a.toString(
    crypto.hash(b4a.from(identity.id + roomCode + sealedAt + JSON.stringify(openPick))),
    'hex'
  )

  const seal = {
    peerId: identity.id,
    name: identity.name,
    color: identity.color,
    roomCode,
    sealedAt,
    commitment,
    revealed: true,
    pick: openPick
  }

  await sealsCore.append(b4a.from(JSON.stringify(seal)))
  room.seals.set(seal.peerId + ':' + seal.sealedAt, seal)
  pushHistory({ kind: 'seal', peerId: seal.peerId, commitment, sealedAt })
  broadcast({ type: 'seal', seal })
  emit({ type: 'sealed', seal })
  emit(snapshot())
}

function setPhase(next) {
  if (!joined) return
  phase = next
  pushHistory({ kind: 'phase', phase, t: now() })
  broadcast({ type: 'phase', phase, matchMeta })
  emit(snapshot())
}

function setMatchMeta(meta) {
  matchMeta = { ...matchMeta, ...meta }
  broadcast({ type: 'match-meta', matchMeta })
  emit(snapshot())
}

function leaveRoom() {
  if (roomTopic) swarm.leave(roomTopic).catch(() => {})
  for (const { conn } of peers.values()) {
    try {
      conn.destroy()
    } catch {}
  }
  peers.clear()
  joined = false
  roomCode = null
  roomTopic = null
  room.peers.clear()
  registerLocalPeer()
  emit({ type: 'left' })
  emit(snapshot())
}

Bare.IPC.on('data', async (data) => {
  let msg
  try {
    msg = JSON.parse(b4a.toString(data))
  } catch {
    return
  }

  try {
    switch (msg.type) {
      case 'ping':
        emit({ type: 'pong', t: now() })
        break
      case 'get-state':
        emit(snapshot())
        break
      case 'create-room':
        await createRoom(msg.matchMeta || null)
        break
      case 'join-room':
        await joinRoom(msg.roomCode, msg.matchMeta || null)
        break
      case 'leave-room':
        leaveRoom()
        break
      case 'profile':
        await updateProfile(msg)
        break
      case 'pulse':
        firePulse(msg)
        break
      case 'chant':
        fireChant(msg.chantId)
        break
      case 'seal':
        await sealPrediction(msg.pick || {})
        break
      case 'set-phase':
        setPhase(msg.phase)
        break
      case 'set-match':
        setMatchMeta(msg.matchMeta || {})
        break
      case 'shutdown':
        leaveRoom()
        try {
          await store.close()
        } catch {}
        break
      default:
        emit({ type: 'error', message: 'Unknown command: ' + msg.type })
    }
  } catch (err) {
    emit({ type: 'error', message: err.message || String(err) })
  }
})

await initStorage()
