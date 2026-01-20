'use client'

import { ModeToggle } from './ModeToggle'

export interface AppShellProps {
  children: React.ReactNode
  mode: 'simple' | 'expert'
  onModeChange: (mode: 'simple' | 'expert') => void
  user?: {
    name: string
    avatarUrl?: string
  }
  onLogout?: () => void
}

export function AppShell({
  children,
  mode,
  onModeChange,
}: AppShellProps) {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background dark">
      {/* Map/Content fills entire viewport */}
      <div className="absolute inset-0">{children}</div>

      {/* Translucent Top Bar with Logo */}
      <header className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 pointer-events-none">
        {/* Logo - Left side */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/20">
            <span className="text-sm font-bold text-primary-foreground">AP</span>
          </div>
          <span className="text-lg font-semibold text-foreground/90 drop-shadow-sm">
            Aadhaar Pulse
          </span>
        </div>

        {/* Simple Mode Toggle - Right side (like a theme toggle) */}
        <div className="pointer-events-auto">
          <ModeToggle mode={mode} onModeChange={onModeChange} />
        </div>
      </header>
    </div>
  )
}
