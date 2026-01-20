'use client'

import type { MapAndTimelineProps, State } from './types'
import { Play, Pause, TrendingUp, TrendingDown, Users, FileText, Fingerprint, Info } from 'lucide-react'
import { useState } from 'react'
import { IndiaMap } from './IndiaMap'

// Card explanations for hover tooltips - focused on WHY these metrics matter
const CARD_EXPLANATIONS = {
  enrolments: {
    title: 'Total Enrolments',
    description: 'Why this matters: Universal Aadhaar coverage is critical for inclusive governance and ensuring no citizen is left behind in digital welfare delivery.',
    details: 'Without Aadhaar, citizens cannot access subsidies, scholarships, or government services. Tracking enrolment growth helps identify underserved regions that need targeted outreach to prevent digital exclusion.',
  },
  demographic: {
    title: 'Demographic Updates',
    description: 'Why this matters: Accurate demographic data ensures citizens receive benefits at the right address and prevents service delivery failures.',
    details: 'Outdated addresses cause missed welfare payments, wrong ration card distributions, and failed document delivery. High update rates may signal population mobility or recovery from past data errors, both requiring policy attention.',
  },
  biometric: {
    title: 'Biometric Updates',
    description: 'Why this matters: Current biometrics are essential for authentication - outdated data locks citizens out of essential services.',
    details: 'Children must update at age 5 and 15 as features change. Delayed updates cause authentication failures at ration shops, banks, and hospitals. Monitoring lag helps prevent service access crises for vulnerable populations.',
  },
}

// Tooltip component with warm color scheme
function Tooltip({
  children,
  content
}: {
  children: React.ReactNode
  content: { title: string; description: string; details: string }
}) {
  const [show, setShow] = useState(false)

  return (
    <div className="relative">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
      {show && (
        <div className="absolute bottom-full left-1/2 z-50 mb-2 w-72 -translate-x-1/2 rounded-lg bg-stone-900 p-4 shadow-xl">
          <div className="flex items-start gap-2">
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-400" />
            <div>
              <p className="font-medium text-white">{content.title}</p>
              <p className="mt-1 text-sm text-stone-300">{content.description}</p>
              <p className="mt-2 text-xs text-stone-400">{content.details}</p>
            </div>
          </div>
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-8 border-transparent border-t-stone-900" />
        </div>
      )}
    </div>
  )
}

// Summary card with hover explanation and warm color scheme
function SummaryCard({
  title,
  value,
  growth,
  icon: Icon,
  explanation,
}: {
  title: string
  value: number
  growth: number
  icon: React.ComponentType<{ className?: string }>
  explanation: { title: string; description: string; details: string }
}) {
  const isPositive = growth >= 0
  return (
    <Tooltip content={explanation}>
      <div className="group cursor-help rounded-xl border border-stone-700/50 bg-stone-800/80 p-4 backdrop-blur-sm transition-all hover:border-orange-500/50 hover:bg-stone-800">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium uppercase tracking-wider text-stone-400">
                {title}
              </p>
              <Info className="h-3 w-3 text-stone-500 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <p className="mt-2 font-mono text-2xl font-bold text-white">
              {(value / 1000000).toFixed(1)}M
            </p>
          </div>
          <div className="rounded-lg bg-orange-500/20 p-2">
            <Icon className="h-5 w-5 text-orange-400" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          {isPositive ? (
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-400" />
          )}
          <span
            className={`font-mono text-sm font-medium ${
              isPositive ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {isPositive ? '+' : ''}
            {growth.toFixed(1)}%
          </span>
          <span className="text-xs text-stone-500">vs last month</span>
        </div>
      </div>
    </Tooltip>
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
    <div className="flex items-center gap-4 rounded-xl border border-stone-700/50 bg-stone-800/80 px-4 py-3 backdrop-blur-sm">
      <button
        onClick={onPlayPause}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 text-white transition-all hover:scale-105 hover:bg-orange-500"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
      </button>

      <div className="flex-1">
        <input
          type="range"
          min={0}
          max={periods.length - 1}
          value={selectedIndex}
          onChange={(e) => onIndexChange(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-stone-700"
          style={{
            background: `linear-gradient(to right, #f97316 0%, #f97316 ${(selectedIndex / (periods.length - 1)) * 100}%, #44403c ${(selectedIndex / (periods.length - 1)) * 100}%, #44403c 100%)`,
          }}
        />
        <div className="mt-2 flex justify-between text-xs text-stone-400">
          <span>{periods[0]?.label?.split(' ')[0]}</span>
          <span className="font-medium text-orange-400">
            {periods[selectedIndex]?.label}
          </span>
          <span>{periods[periods.length - 1]?.label?.split(' ')[0]}</span>
        </div>
      </div>
    </div>
  )
}

function SankeyDiagram({
  nodes,
  links,
}: {
  nodes: { id: string; label: string }[]
  links: { source: string; target: string; value: number }[]
}) {
  const maxValue = Math.max(...links.map((l) => l.value))

  return (
    <Tooltip content={{
      title: 'Identity Lifecycle Flow',
      description: 'Why this matters: Understanding update patterns helps predict and prevent authentication failures before they disrupt service access.',
      details: 'Children enrolled early need timely biometric updates. Monitoring these flows helps identify regions where update campaigns should be prioritized to prevent future service disruptions.',
    }}>
      <div className="group cursor-help rounded-xl border border-stone-700/50 bg-stone-800/80 p-4 backdrop-blur-sm transition-all hover:border-orange-500/50 hover:bg-stone-800">
        <div className="mb-3 flex items-center gap-2">
          <h3 className="text-xs font-medium uppercase tracking-wider text-stone-400">
            Identity Lifecycle Flow
          </h3>
          <Info className="h-3 w-3 text-stone-500 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <div className="space-y-2">
          {links.map((link, i) => {
            const width = (link.value / maxValue) * 100
            const sourceNode = nodes.find((n) => n.id === link.source)
            const targetNode = nodes.find((n) => n.id === link.target)
            return (
              <div key={i} className="flex items-center gap-2">
                <span className="w-20 truncate text-[11px] text-stone-400">
                  {sourceNode?.label?.replace('Enrolled ', '')}
                </span>
                <div className="h-5 flex-1 overflow-hidden rounded-full bg-stone-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-500"
                    style={{ width: `${width}%` }}
                  />
                </div>
                <span className="w-20 truncate text-[11px] text-stone-400">
                  {targetNode?.label?.replace('Updated ', '')}
                </span>
                <span className="w-12 text-right font-mono text-[11px] text-stone-500">
                  {(link.value / 1000000).toFixed(1)}M
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </Tooltip>
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

  const selectedIndex = timePeriods.findIndex((p) => p.id === selectedPeriodId) || 0

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    onPlayPause?.(!isPlaying)
  }

  const handleSliderChange = (index: number) => {
    const newPeriodId = timePeriods[index]?.id
    if (newPeriodId) {
      onPeriodChange?.(newPeriodId)
    }
  }

  const handleStateHover = (id: string | null) => {
    setHoveredStateId(id)
    onStateHover?.(id)
  }

  return (
    <div className="relative flex h-full w-full flex-col bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950">
      {/* Map area - takes remaining space */}
      <div className="relative flex-1 overflow-hidden">
        <IndiaMap
          states={states}
          hoveredStateId={hoveredStateId}
          onStateHover={handleStateHover}
          onStateClick={(id) => onStateClick?.(id)}
        />
      </div>

      {/* Bottom panel - fixed height */}
      <div className="border-t border-stone-800 bg-stone-900/95 p-4 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl space-y-4">
          {/* Summary cards row */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              title="Total Enrolments"
              value={nationalSummary.totalEnrolments}
              growth={nationalSummary.enrolmentGrowth}
              icon={Users}
              explanation={CARD_EXPLANATIONS.enrolments}
            />
            <SummaryCard
              title="Demographic Updates"
              value={nationalSummary.demographicUpdates}
              growth={nationalSummary.demographicGrowth}
              icon={FileText}
              explanation={CARD_EXPLANATIONS.demographic}
            />
            <SummaryCard
              title="Biometric Updates"
              value={nationalSummary.biometricUpdates}
              growth={nationalSummary.biometricGrowth}
              icon={Fingerprint}
              explanation={CARD_EXPLANATIONS.biometric}
            />
            <SankeyDiagram nodes={ageGroupFlow.nodes} links={ageGroupFlow.links} />
          </div>

          {/* Time slider */}
          <TimeSlider
            periods={timePeriods}
            selectedIndex={selectedIndex}
            isPlaying={isPlaying}
            onIndexChange={handleSliderChange}
            onPlayPause={handlePlayPause}
          />
        </div>
      </div>
    </div>
  )
}
