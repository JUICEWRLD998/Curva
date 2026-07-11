import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type {
  ClientCommand,
  Identity,
  RoomState,
  WorkerEvent
} from '@/types/curvax'

const emptyState: RoomState = {
  type: 'state',
  identity: { id: '', name: 'Fan', color: '#f5c518' },
  roomCode: null,
  joined: false,
  phase: 'prematch',
  matchMeta: null,
  energy: 0,
  peers: [],
  peerCount: 0,
  pulses: [],
  chants: [],
  seals: [],
  chantsCatalog: [],
  capsuleKey: null,
  historyCount: 0
}

export function useCurvax() {
  const [ready, setReady] = useState(false)
  const [room, setRoom] = useState<RoomState>(emptyState)
  const [toast, setToast] = useState<{ message: string; error?: boolean } | null>(null)
  const [eruption, setEruption] = useState<string | null>(null)
  const [bridgeMissing, setBridgeMissing] = useState(false)
  const toastTimer = useRef<number | null>(null)

  const showToast = useCallback((message: string, error = false) => {
    setToast({ message, error })
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 3200)
  }, [])

  const send = useCallback(async (cmd: ClientCommand) => {
    if (!window.curvax) {
      showToast('Run CURVAX with npm run dev (Electron + Pear worker)', true)
      return
    }
    await window.curvax.send(cmd)
  }, [showToast])

  useEffect(() => {
    if (!window.curvax) {
      setBridgeMissing(true)
      setReady(true)
      setRoom((r) => ({
        ...r,
        identity: { id: 'preview', name: 'Preview Fan', color: '#f5c518' }
      }))
      return
    }

    const off = window.curvax.onEvent((msg: WorkerEvent) => {
      switch (msg.type) {
        case 'ready':
          setReady(true)
          setRoom((prev) => ({ ...prev, identity: msg.identity }))
          break
        case 'state':
          setReady(true)
          setRoom(msg)
          break
        case 'joined':
          showToast(`You’re in ${msg.roomCode}`)
          break
        case 'left':
          showToast('Left the curvax')
          break
        case 'sealed':
          showToast('Prediction sealed on Hypercore')
          break
        case 'eruption':
          setEruption(`${msg.chant.label} · ${msg.chant.count} voices`)
          window.setTimeout(() => setEruption(null), 3500)
          break
        case 'error':
          showToast(msg.message, true)
          break
        default:
          break
      }
    })

    void window.curvax.send({ type: 'get-state' })
    const retry = window.setTimeout(() => {
      void window.curvax?.send({ type: 'get-state' })
    }, 2500)

    return () => {
      off()
      window.clearTimeout(retry)
    }
  }, [showToast])

  const identity: Identity = useMemo(
    () => room.identity || emptyState.identity,
    [room.identity]
  )

  return {
    ready,
    room,
    identity,
    toast,
    eruption,
    bridgeMissing,
    send,
    showToast
  }
}
