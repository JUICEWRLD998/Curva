import { ChantCard } from './ChantCard'
import type { ChantCatalogItem, ChantLive } from '@/types/curvax'

interface Props {
  catalog: ChantCatalogItem[]
  liveChants: ChantLive[]
  onChantClick: (id: string) => void
}

export function ChantGrid({ catalog, liveChants, onChantClick }: Props) {
  return (
    <div className="glass chant-section">
      <div className="energy-head">
        <h3>Chant Circles</h3>
        <span className="text-muted">Join the same chant — erupt together</span>
      </div>
      
      <div className="chant-grid">
        {catalog.map((chant) => {
          // Find if this chant is currently live
          const liveChant = liveChants.find((live) => 
            live.id.startsWith(`${chant.id}:`)
          )
          
          const isActive = !!liveChant
          const voiceCount = liveChant?.count || 0
          
          return (
            <ChantCard
              key={chant.id}
              id={chant.id}
              label={chant.label}
              isActive={isActive}
              voiceCount={voiceCount}
              maxVoices={6}
              onClick={() => onChantClick(chant.id)}
            />
          )
        })}
      </div>
    </div>
  )
}
