export type MatchPhase = 'prematch' | 'live' | 'fulltime'

export type PulseKind = 'goal' | 'save' | 'foul' | 'card' | 'roar'

export interface Identity {
  id: string
  name: string
  color: string
}

export interface Peer {
  id: string
  name: string
  color: string
  lastSeen?: number
  self?: boolean
}

export interface MatchMeta {
  home: string
  away: string
  label?: string
  kickoff?: string | null
}

export interface PulseEvent {
  id: string
  peerId: string
  name: string
  color: string
  kind: PulseKind | string
  intensity: number
  t: number
}

export interface ChantLive {
  id: string
  label: string
  starter: string
  count: number
  joined: string[]
  startedAt: number
}

export interface ChantCatalogItem {
  id: string
  label: string
}

export interface PredictionPick {
  winner: 'home' | 'away' | 'draw'
  homeScore: number
  awayScore: number
  scorer?: string
}

export interface Seal {
  peerId: string
  name: string
  color: string
  roomCode: string
  sealedAt: number
  commitment: string
  revealed?: boolean
  pick?: PredictionPick
}

export interface RoomState {
  type: 'state'
  identity: Identity
  roomCode: string | null
  joined: boolean
  phase: MatchPhase
  matchMeta: MatchMeta | null
  energy: number
  peers: Peer[]
  peerCount: number
  pulses: PulseEvent[]
  chants: ChantLive[]
  seals: Seal[]
  chantsCatalog: ChantCatalogItem[]
  capsuleKey: string | null
  historyCount: number
}

export type WorkerEvent =
  | RoomState
  | { type: 'ready'; identity: Identity }
  | { type: 'joined'; roomCode: string; topic?: string }
  | { type: 'left' }
  | { type: 'pulse'; pulse: PulseEvent; energy: number }
  | { type: 'eruption'; chant: { id: string; label: string; count: number } }
  | { type: 'sealed'; seal: Seal }
  | { type: 'error'; message: string }
  | { type: 'peer-connected'; peerId: string; count: number }
  | { type: 'pong'; t: number }
  | { type: 'parse-error'; raw: string; error: string }

export type ClientCommand =
  | { type: 'get-state' }
  | { type: 'ping' }
  | { type: 'create-room'; matchMeta?: MatchMeta }
  | { type: 'join-room'; roomCode: string; matchMeta?: MatchMeta }
  | { type: 'leave-room' }
  | { type: 'profile'; name?: string; color?: string }
  | { type: 'pulse'; kind: string; intensity?: number }
  | { type: 'chant'; chantId: string }
  | { type: 'seal'; pick: PredictionPick }
  | { type: 'set-phase'; phase: MatchPhase }
  | { type: 'set-match'; matchMeta: Partial<MatchMeta> }

export interface CurvaxBridge {
  send: (payload: ClientCommand | string) => Promise<{ ok: boolean; reason?: string }>
  onEvent: (listener: (event: WorkerEvent) => void) => () => void
}

declare global {
  interface Window {
    curvax?: CurvaxBridge
  }
}

export {}
