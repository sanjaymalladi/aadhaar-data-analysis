'use client'

import type { State } from './types'
import { useState, useRef, useMemo, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { X } from 'lucide-react'

// State code to full name mapping
const STATE_CODE_MAP: Record<string, string> = {
  'AN': 'Andaman & Nicobar Island',
  'AP': 'Andhra Pradesh',
  'AR': 'Arunachal Pradesh',
  'AS': 'Assam',
  'BR': 'Bihar',
  'CH': 'Chandigarh',
  'CG': 'Chhattisgarh',
  'DN': 'Dadra and Nagar Haveli',
  'DD': 'Daman & Diu',
  'DL': 'Delhi',
  'GA': 'Goa',
  'GJ': 'Gujarat',
  'HR': 'Haryana',
  'HP': 'Himachal Pradesh',
  'JK': 'Jammu & Kashmir',
  'JH': 'Jharkhand',
  'KA': 'Karnataka',
  'KL': 'Kerala',
  'LA': 'Ladakh',
  'LD': 'Lakshadweep',
  'MP': 'Madhya Pradesh',
  'MH': 'Maharashtra',
  'MN': 'Manipur',
  'ML': 'Meghalaya',
  'MZ': 'Mizoram',
  'NL': 'Nagaland',
  'OD': 'Odisha',
  'PY': 'Puducherry',
  'PB': 'Punjab',
  'RJ': 'Rajasthan',
  'SK': 'Sikkim',
  'TN': 'Tamil Nadu',
  'TS': 'Telangana',
  'TR': 'Tripura',
  'UP': 'Uttar Pradesh',
  'UK': 'Uttarakhand',
  'WB': 'West Bengal',
}

// Reverse mapping from name to code
const NAME_TO_CODE: Record<string, string> = Object.entries(STATE_CODE_MAP).reduce(
  (acc, [code, name]) => ({ ...acc, [name.toLowerCase()]: code }),
  {}
)

interface IndiaMapProps {
  states: State[]
  hoveredStateId: string | null
  onStateHover: (id: string | null) => void
  onStateClick: (id: string) => void
}

// Dynamic import for ReactDatamaps to avoid SSR issues
const ReactDatamaps = dynamic(
  () => import('react-india-states-map').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }
)

export function IndiaMap({
  states,
  hoveredStateId,
  onStateHover,
  onStateClick,
}: IndiaMapProps) {
  const [selectedState, setSelectedState] = useState<{ name: string; data: State | null } | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const mapContainerRef = useRef<HTMLDivElement>(null)

  const getStateData = useCallback((stateName: string): State | undefined => {
    const code = NAME_TO_CODE[stateName.toLowerCase()]
    return states.find(s => s.code === code || s.id === code || s.name.toLowerCase() === stateName.toLowerCase())
  }, [states])

  // Build state data for the map - Memoized to prevent re-renders
  const statesData = useMemo(() => states.reduce((acc, state) => {
    const fullName = STATE_CODE_MAP[state.code] || state.name
    acc[fullName] = {
      value: state.enrolments,
      ...state
    }
    return acc
  }, {} as Record<string, unknown>), [states])

  // Clean up black elements and style the SVG after mount
  useEffect(() => {
    const cleanup = () => {
      const container = mapContainerRef.current
      if (!container) return

      // Hide any tooltip-like black elements
      container.querySelectorAll('div').forEach((div) => {
        const style = window.getComputedStyle(div)
        if (style.backgroundColor === 'rgb(0, 0, 0)' && !div.querySelector('svg')) {
          div.style.cssText = 'display: none !important; visibility: hidden !important;'
        }
      })

      // Find and style the SVG - SMALLER SIZE
      const svg = container.querySelector('svg')
      if (svg) {
        svg.style.cssText = `
          display: block !important;
          margin: 0 auto !important;
          height: min(65vh, 450px) !important;
          width: auto !important;
          max-width: 90vw !important;
        `
      }

      // Find and center the SVG's parent wrapper
      const svgParent = svg?.parentElement
      if (svgParent && svgParent !== container) {
        svgParent.style.cssText = `
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 100% !important;
          height: 100% !important;
        `
      }
    }

    cleanup()
    const t1 = setTimeout(cleanup, 100)
    const t2 = setTimeout(cleanup, 500)
    const t3 = setTimeout(cleanup, 1000)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [])

  // Close tooltip when clicking outside
  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (!target.closest('path')) {
      setSelectedState(null)
      onStateHover(null)
    }
  }, [onStateHover])

  // Handle state click - show tooltip
  const handleStateClick = useCallback((stateName: string) => {
    const state = getStateData(stateName)
    const code = NAME_TO_CODE[stateName.toLowerCase()]

    if (selectedState?.name === stateName) {
      setSelectedState(null)
      onStateHover(null)
    } else {
      setSelectedState({ name: stateName, data: state || null })
      if (code) {
        onStateHover(code)
        onStateClick(code)
      }
    }
  }, [getStateData, onStateClick, onStateHover, selectedState])

  // Track mouse position for tooltip positioning
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setTooltipPos({ x: e.clientX, y: e.clientY })
  }, [])

  // Close tooltip button
  const closeTooltip = useCallback(() => {
    setSelectedState(null)
    onStateHover(null)
  }, [onStateHover])

  // The HoverComponent returns null - we're not using hover for tooltip
  const HoverComponent = useCallback(() => null, [])

  return (
    <div
      ref={mapContainerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--background)',
        overflow: 'hidden',
      }}
      onMouseMove={handleMouseMove}
      onClick={handleContainerClick}
    >
      {/* Map Container */}
      <div
        style={{
          width: '100%',
          height: 'auto',
          maxHeight: 'calc(100vh - 200px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ReactDatamaps
          regionData={statesData}
          mapLayout={{
            title: '',
            legendTitle: '',
            startColor: '#22c55e',
            endColor: '#ef4444',
            hoverTitle: 'Enrolments',
            noDataColor: '#3f3f46',
            borderColor: '#52525b',
            hoverColor: '#ec4899',
            hoverBorderColor: '#ec4899',
            height: 10,
            weight: 30,
          }}
          hoverComponent={HoverComponent}
          onClick={(value: any) => {
            if (value && typeof value === 'object' && 'name' in value) {
              handleStateClick(value.name)
            }
          }}
        />
      </div>

      {/* COMPACT Click-based Tooltip */}
      {selectedState?.data && (
        <div
          className="fixed z-[100] rounded-lg bg-card/95 backdrop-blur-sm px-3 py-2 shadow-xl border border-border text-sm"
          style={{
            left: Math.min(Math.max(tooltipPos.x + 15, 10), typeof window !== 'undefined' ? window.innerWidth - 200 : 500),
            top: Math.min(Math.max(tooltipPos.y - 80, 10), typeof window !== 'undefined' ? window.innerHeight - 150 : 400),
          }}
        >
          {/* Close button */}
          <button
            onClick={closeTooltip}
            className="absolute -top-2 -right-2 p-0.5 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          <p className="font-semibold text-card-foreground text-sm">{selectedState.data.name}</p>
          <div className="mt-1.5 space-y-0.5 text-xs">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Enrolments</span>
              <span className="font-mono font-medium text-primary">
                {(selectedState.data.enrolments / 1000000).toFixed(1)}M
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Demographic</span>
              <span className="font-mono font-medium text-chart-3">
                {(selectedState.data.demographicUpdates / 1000000).toFixed(1)}M
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Biometric</span>
              <span className="font-mono font-medium text-chart-2">
                {(selectedState.data.biometricUpdates / 1000000).toFixed(1)}M
              </span>
            </div>
          </div>
          <div className="mt-1.5 flex items-center gap-1.5 pt-1.5 border-t border-border">
            <span
              className={`h-2 w-2 rounded-full ${selectedState.data.healthIndicator === 'high'
                ? 'bg-destructive'
                : selectedState.data.healthIndicator === 'medium'
                  ? 'bg-chart-5'
                  : 'bg-chart-3'
                }`}
            />
            <span className="text-xs capitalize text-muted-foreground">
              {selectedState.data.healthIndicator} stress
            </span>
          </div>
        </div>
      )}

      {/* Legend - Bottom Left */}
      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 rounded-lg bg-card/80 px-3 py-2 sm:px-4 sm:py-3 backdrop-blur-md border border-border z-10">
        <p className="mb-1.5 sm:mb-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stress Level</p>
        <div className="flex flex-col gap-1 sm:gap-1.5">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded bg-chart-3" />
            <span className="text-[10px] sm:text-xs text-foreground/80">Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded bg-chart-5" />
            <span className="text-[10px] sm:text-xs text-foreground/80">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded bg-destructive" />
            <span className="text-[10px] sm:text-xs text-foreground/80">High</span>
          </div>
        </div>
      </div>

      {/* Click hint */}
      {!selectedState && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs text-muted-foreground/60 bg-card/50 px-2.5 py-1 rounded-full backdrop-blur-sm">
          Click a state to view details
        </div>
      )}
    </div>
  )
}
