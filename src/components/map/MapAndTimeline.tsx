'use client'

import type { MapAndTimelineProps, State } from './types'
import {
  Play,
  Pause,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Fingerprint,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { useState, useRef } from 'react'
import { IndiaMap } from './IndiaMap'

// Simplified "Explain Like I'm 5" explanations
const CARD_EXPLANATIONS = {
  enrolments: {
    title: 'Total Enrolments',
    description: 'How many people have an Aadhaar card.',
    details: 'Think of this as the total number of people who have signed up and got their unique ID card.',
  },
  demographic: {
    title: 'Name & Address Updates',
    description: 'People changing their details.',
    details: 'This counts whenever someone fixes a spelling mistake in their name, changes their address after moving, or updates their phone number.',
  },
  biometric: {
    title: 'Photo & Fingerprint Updates',
    description: 'People updating their physical data.',
    details: 'This is when people update their photo, fingerprints, or eye scans. Kids need to do this when they turn 5 and 15!',
  },
  lifecycle: {
    title: 'Identity Flow',
    description: 'The journey from signing up to updating.',
    details: 'Shows how many new people are joining versus how many existing members are updating their details.',
  }
}

// Flip Card - 3D flip effect with number on front, explanation on back
function BentoItem({
  title,
  value,
  growth,
  icon: Icon,
  explanation,
  className = "",
  size = "normal",
  growthColor = "chart-3"
}: {
  title: string
  value: number | string
  growth?: number
  icon: React.ComponentType<{ className?: string }>
  explanation: { title: string; description: string; details: string }
  className?: string
  size?: "normal" | "large" | "wide"
  growthColor?: string
}) {
  const [isFlipped, setIsFlipped] = useState(false)
  const isPositive = growth !== undefined && growth >= 0

  // Color mapping for growth badges
  const colorMap: Record<string, { bg: string; text: string }> = {
    'chart-3': { bg: 'hsl(var(--chart-3) / 0.1)', text: 'hsl(var(--chart-3))' },
    'pink-500': { bg: 'rgb(236 72 153 / 0.1)', text: 'rgb(236 72 153)' },
  }
  const colors = colorMap[growthColor] || colorMap['chart-3']

  return (
    <div
      className={`group relative h-full cursor-pointer [perspective:1000px] ${className}`}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
      >
        {/* Front Face - Shows the number */}
        <div className="absolute inset-0 h-full w-full overflow-hidden rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-sm [backface-visibility:hidden]">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 blur-xl" />

          <div className="relative z-10 flex h-full flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="rounded-lg bg-muted/30 p-2 text-muted-foreground">
                <Icon className="h-5 w-5" />
              </div>
              {growth !== undefined && (
                <div
                  className="flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium"
                  style={isPositive ? {
                    backgroundColor: colors.bg,
                    color: colors.text
                  } : undefined}
                >
                  {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  <span>{Math.abs(growth).toFixed(1)}%</span>
                </div>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className={`font-mono font-bold text-foreground tracking-tight ${size === 'large' ? 'text-4xl mt-2' : 'text-2xl mt-1'}`}>
                {value}
              </p>
            </div>
          </div>

          {/* Flip hint */}
          <div className="absolute bottom-3 right-3 text-xs text-muted-foreground/50">
            Hover to flip
          </div>
        </div>

        {/* Back Face - Shows the explanation */}
        <div className="absolute inset-0 h-full w-full overflow-hidden rounded-2xl border border-primary/50 bg-card/60 p-5 backdrop-blur-sm [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="absolute -left-6 -bottom-6 h-24 w-24 rounded-full bg-gradient-to-br from-accent/10 to-primary/10 blur-xl" />

          <div className="relative z-10 flex h-full flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
                <Info className="h-4 w-4 text-primary" />
              </div>
              <p className="font-semibold text-foreground">{explanation.title}</p>
            </div>

            <p className="text-sm font-medium text-primary mb-3">{explanation.description}</p>

            <p className={`leading-relaxed text-muted-foreground flex-1 ${size === 'large' ? 'text-base' : 'text-sm'}`}>
              {explanation.details}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function TimeSlider({
  periods,
  selectedIndex,
  isPlaying,
  onIndexChange,
  onPlayPause,
}: {
  periods: { id: string; label: string }[]
  selectedIndex: number
  isPlaying: boolean
  onIndexChange: (index: number) => void
  onPlayPause: () => void
}) {
  return (
    <div className="mt-8 flex items-center gap-6 rounded-2xl border border-border bg-card/40 px-6 py-4 backdrop-blur-sm">
      <button
        onClick={onPlayPause}
        className="group flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:brightness-110 active:scale-95"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5 fill-current" />
        ) : (
          <Play className="ml-1 h-5 w-5 fill-current" />
        )}
      </button>

      <div className="flex-1">
        <div className="mb-3 flex justify-between text-sm">
          <span className="font-medium text-muted-foreground">{periods[0]?.label}</span>
          <span className="font-bold text-primary">{periods[selectedIndex]?.label}</span>
          <span className="font-medium text-muted-foreground">{periods[periods.length - 1]?.label}</span>
        </div>
        <input
          type="range"
          min={0}
          max={periods.length - 1}
          value={selectedIndex}
          onChange={(e) => onIndexChange(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted"
        />
      </div>
    </div>
  )
}

export function MapAndTimeline({
  timePeriods,
  selectedPeriodId,
  nationalSummary,
  ageGroupFlow,
  states,
  onPeriodChange,
  onStateClick,
  onStateHover,
  onPlayPause,
}: MapAndTimelineProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hoveredStateId, setHoveredStateId] = useState<string | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  const selectedIndex = timePeriods.findIndex((p) => p.id === selectedPeriodId) || 0

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    onPlayPause?.(!isPlaying)
  }

  const handleSliderChange = (index: number) => {
    onPeriodChange?.(timePeriods[index].id)
  }

  const handleStateHover = (id: string | null) => {
    setHoveredStateId(id)
    onStateHover?.(id)
  }

  const scrollToStats = () => {
    statsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToMap = () => {
    mapRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="relative w-full bg-background text-foreground selection:bg-primary/30">

      {/* SECTION 1: Full-Page Map */}
      <section ref={mapRef} className="relative h-screen w-full overflow-hidden">
        <IndiaMap
          states={states}
          hoveredStateId={hoveredStateId}
          onStateHover={handleStateHover}
          onStateClick={(id) => onStateClick?.(id)}
        />

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground/80">Scroll for Analytics</span>
          <button
            onClick={scrollToStats}
            className="animate-bounce rounded-full bg-card/80 p-2 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-card hover:text-foreground border border-border"
          >
            <ChevronDown className="h-6 w-6" />
          </button>
        </div>
      </section>

      {/* SECTION 2: Bento Grid Stats */}
      <section ref={statsRef} className="min-h-screen w-full bg-background px-6 py-20 relative">
        {/* Background Gradients */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[100px]" />
          <div className="absolute -right-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">National Overview</h2>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Key performance indicators for Aadhaar enrolment and update services across the nation.
            </p>
          </div>

          {/* Bento Grid Layout - 3 Equal Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 min-h-[300px]">

            {/* Total Enrolments */}
            <BentoItem
              title="Total Enrolments"
              value={`${(nationalSummary.totalEnrolments / 1000000).toFixed(1)}M`}
              growth={nationalSummary.enrolmentGrowth}
              icon={Users}
              explanation={CARD_EXPLANATIONS.enrolments}
            />

            {/* Demographic Updates */}
            <BentoItem
              title="Demographic Updates"
              value={`${(nationalSummary.demographicUpdates / 1000000).toFixed(1)}M`}
              growth={nationalSummary.demographicGrowth}
              icon={FileText}
              explanation={CARD_EXPLANATIONS.demographic}
            />

            {/* Biometric Updates */}
            <BentoItem
              title="Biometric Updates"
              value={`${(nationalSummary.biometricUpdates / 1000000).toFixed(1)}M`}
              growth={nationalSummary.biometricGrowth}
              icon={Fingerprint}
              explanation={CARD_EXPLANATIONS.biometric}
              growthColor="pink-500"
            />
          </div>



          {/* Scroll to Map Button */}
          <div className="mt-12 flex flex-col items-center gap-2">
            <button
              onClick={scrollToMap}
              className="animate-bounce rounded-full bg-card/80 p-2 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-card hover:text-foreground border border-border"
            >
              <ChevronUp className="h-6 w-6" />
            </button>
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground/80">Back to Map</span>
          </div>
        </div>
      </section>
    </div>
  )
}
