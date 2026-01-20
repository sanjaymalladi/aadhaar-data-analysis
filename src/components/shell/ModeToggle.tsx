'use client'

import { BarChart3, Map } from 'lucide-react'

export interface ModeToggleProps {
  mode: 'simple' | 'expert'
  onModeChange: (mode: 'simple' | 'expert') => void
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-muted/80 backdrop-blur-md p-1 border border-border/50">
      <button
        type="button"
        onClick={() => onModeChange('simple')}
        className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${mode === 'simple'
            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          }`}
      >
        <Map className="h-4 w-4" />
        Map View
      </button>

      <button
        type="button"
        onClick={() => onModeChange('expert')}
        className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${mode === 'expert'
            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          }`}
      >
        <BarChart3 className="h-4 w-4" />
        Expert Analytics
      </button>
    </div>
  )
}
