'use client'

import { useState } from 'react'
import { LogOut, Settings } from 'lucide-react'

export interface UserMenuProps {
  user?: {
    name: string
    avatarUrl?: string
  }
  onLogout?: () => void
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U'

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-lg backdrop-blur-sm transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-slate-900/80 dark:focus:ring-offset-slate-900"
      >
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {initials}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 top-12 z-20 w-56 rounded-lg bg-white/95 p-2 shadow-xl backdrop-blur-sm dark:bg-slate-900/95">
            {user && (
              <div className="border-b border-slate-200 px-3 py-2 dark:border-slate-700">
                <p className="font-medium text-slate-900 dark:text-white">
                  {user.name}
                </p>
              </div>
            )}

            <div className="py-1">
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Settings className="h-4 w-4" />
                Settings
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  onLogout?.()
                }}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
