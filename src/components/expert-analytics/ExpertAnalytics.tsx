'use client'

import type {
  ExpertAnalyticsProps,
  TimeSeriesPoint,
  CorrelationPoint,
  HeatmapCell,
  StateIndex,
  Anomaly,
} from './types'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Download,
  AlertTriangle,
  Activity,
  Clock,
  Info,
  ChevronRight,
  BarChart3,
  Map,
  Bell,
  Search,
} from 'lucide-react'
import { useState } from 'react'
import { IndiaMap } from '../map/IndiaMap'

// --- SHARED UI COMPONENTS (Ideally these go to a UI folder, but keeping here for now as requested) ---

// Flip Card - 3D flip effect with number on front, explanation on back
function BentoFlipCard({
  title,
  value,
  trend,
  percentile,
  icon: Icon,
  explanation,
  className = "",
  size = "normal",
  trendValues, // Optional: { current, previous }
}: {
  title: string
  value: number | string
  trend?: 'up' | 'down' | 'stable'
  percentile?: number
  icon: React.ComponentType<{ className?: string }>
  explanation: { title: string; description: string; details: string }
  className?: string
  size?: "normal" | "large" | "wide"
  trendValues?: { current: number; previous: number }
}) {
  const [isFlipped, setIsFlipped] = useState(false)

  // Determine trend color and icon
  const isPositive = trend === 'up'
  const isNegative = trend === 'down'

  // Theme colors usage
  // We use bg-chart-X/10 for backgrounds to avoid hardcoded opacity with hex

  return (
    <div
      className={`group relative h-full min-h-[220px] cursor-pointer [perspective:1000px] ${className}`}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
      >
        {/* Front Face */}
        <div className="absolute inset-0 h-full w-full overflow-hidden rounded-2xl bg-card/40 p-6 backdrop-blur-sm [backface-visibility:hidden] transition-colors">
          {/* Ambient background glow */}
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 blur-2xl" />

          <div className="relative z-10 flex h-full flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="rounded-xl bg-muted/50 p-3 text-muted-foreground ring-1 ring-border/50">
                <Icon className="h-6 w-6" />
              </div>
              {trend && (
                <div
                  className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${isNegative
                    ? 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/20' // Good for Friction/Lag usually
                    : 'bg-amber-500/10 text-amber-500 ring-amber-500/20'
                    }`}
                >
                  {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  <span>{trendValues ? `${Math.abs(((trendValues.current - trendValues.previous) / trendValues.previous) * 100).toFixed(1)}%` : ''}</span>
                </div>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="font-mono text-4xl font-bold text-foreground tracking-tight">
                  {typeof value === 'number' ? value.toFixed(2) : value}
                </p>
                {percentile && (
                  <span className="text-xs font-medium text-muted-foreground">TOP {percentile}%</span>
                )}
              </div>
            </div>
          </div>

          {/* Flip hint */}
          <div className="absolute bottom-4 right-4 text-[10px] font-medium uppercase tracking-widest text-muted-foreground/40 group-hover:text-primary/60 transition-colors">
            Hover Info
          </div>
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 h-full w-full overflow-hidden rounded-2xl border border-primary/30 bg-card/95 p-6 backdrop-blur-xl [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-xl shadow-primary/5">
          <div className="absolute -left-6 -bottom-6 h-32 w-32 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 blur-2xl" />

          <div className="relative z-10 flex h-full flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Info className="h-4 w-4" />
              </div>
              <p className="font-semibold text-foreground text-sm">{explanation.title}</p>
            </div>

            <p className="text-xs font-medium text-primary mb-3 leading-snug">{explanation.description}</p>

            <p className="text-sm leading-relaxed text-muted-foreground">
              {explanation.details}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- REUSABLE FLIP CONTAINER ---
function FlipContainer({
  front,
  back,
  className = "",
}: {
  front: React.ReactNode
  back: React.ReactNode
  className?: string
}) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div
      className={`group relative w-full cursor-pointer [perspective:1000px] ${className}`}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
      >
        {/* Front Face - Relative to set height */}
        <div className="relative w-full h-full [backface-visibility:hidden]">
          {front}
          {/* Hint */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
            <Info className="h-4 w-4 text-muted-foreground/50" />
          </div>
        </div>

        {/* Back Face - Absolute to overlay */}
        <div className="absolute inset-0 h-full w-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
          {back}
        </div>
      </div>
    </div>
  )
}

// Reuse for standard Front/Back card styling to ensure consistency
function CardBack({ explanation }: { explanation: { title: string; description: string; details: string } }) {
  return (
    <div className="h-full w-full overflow-hidden rounded-2xl border border-primary/30 bg-card/95 p-6 backdrop-blur-xl shadow-xl shadow-primary/5 flex flex-col items-center justify-center text-center">
      <div className="absolute -left-6 -bottom-6 h-32 w-32 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 blur-2xl pointer-events-none" />

      <div className="relative z-10 p-4">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Info className="h-6 w-6" />
        </div>
        <h4 className="mb-2 text-lg font-semibold text-foreground">{explanation.title}</h4>
        <p className="mb-4 text-sm font-medium text-primary">{explanation.description}</p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {explanation.details}
        </p>
      </div>
    </div>
  )
}


// --- HELPER FOR SMOOTH CURVES ---
function getSmoothPath(points: { x: number, y: number }[]) {
  if (points.length < 2) return ""

  // Basic Catmull-Rom or similar smoothing could go here, 
  // but for simplicity/robustness without extra libs, we'll use a cubic bezier approach
  // or a simple line for now but with slightly rounded corners if possible?
  // Actually, let's just implement a simple smoothing function.

  const controlPoint = (current: any, previous: any, next: any, reverse?: boolean) => {
    const p = previous || current
    const n = next || current
    const smoothing = 0.2
    const o = {
      x: n.x - p.x,
      y: n.y - p.y
    }
    return {
      x: current.x + (reverse ? -1 : 1) * o.x * smoothing,
      y: current.y + (reverse ? -1 : 1) * o.y * smoothing
    }
  }

  let d = `M ${points[0].x},${points[0].y}`

  for (let i = 0; i < points.length - 1; i++) {
    const cps = controlPoint(points[i], points[i - 1], points[i + 1])
    const cpe = controlPoint(points[i + 1], points[i], points[i + 2], true)
    d += ` C ${cps.x},${cps.y} ${cpe.x},${cpe.y} ${points[i + 1].x},${points[i + 1].y}`
  }
  return d
}

// Simple Line Chart (Styled & Smoothed & FLIPPABLE)
function BentoLineChart({
  data,
  label,
  color = "var(--primary)",
  explanation
}: {
  data: TimeSeriesPoint[];
  label: string,
  color?: string,
  explanation: { title: string; description: string; details: string }
}) {
  if (!data.length) return null

  const values = data.map((d) => d.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = 50 - ((d.value - min) / range) * 45
    return { x, y }
  })

  // Close the path for the fill area
  const smoothLine = getSmoothPath(points)
  const fillPath = `${smoothLine} L 100,50 L 0,50 Z`

  const Front = (
    <div className="group relative overflow-hidden rounded-2xl bg-card/40 p-6 backdrop-blur-sm transition-all h-full">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">{label}</h4>
        <BarChart3 className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
      </div>

      <div className="relative h-48 w-full">
        <svg viewBox="0 0 100 50" className="h-full w-full overflow-visible" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`gradient-${label}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.5" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
            <filter id={`glow-${label}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {[0, 12.5, 25, 37.5, 50].map((y) => (
            <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="currentColor" strokeWidth="0.05" className="text-muted-foreground/30" />
          ))}

          <path d={fillPath} fill={`url(#gradient-${label})`} className="transition-all duration-300" />
          <path d={smoothLine} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-md" filter={`url(#glow-${label})`} />
        </svg>

        <div className="absolute top-0 right-0 p-2 rounded bg-popover/80 backdrop-blur border border-border text-[10px] text-popover-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          Max: {(max / 1000000).toFixed(1)}M
        </div>
      </div>

      <div className="mt-4 flex justify-between text-[10px] uppercase font-medium text-muted-foreground/60">
        <span>{data[0]?.date}</span>
        <span>{data[Math.floor(data.length / 2)]?.date}</span>
        <span>{data[data.length - 1]?.date}</span>
      </div>
    </div>
  )

  return <FlipContainer front={Front} back={<CardBack explanation={explanation} />} />
}

function BentoScatterPlot({
  data,
  xLabel,
  yLabel,
  onPointClick,
  explanation,
}: {
  data: CorrelationPoint[]
  xLabel: string
  yLabel: string
  onPointClick?: (stateId: string) => void
  explanation: { title: string; description: string; details: string }
}) {
  const xValues = data.map((d) => d.x)
  const yValues = data.map((d) => d.y)
  const xMin = Math.min(...xValues)
  const xMax = Math.max(...xValues)
  const yMin = Math.min(...yValues)
  const yMax = Math.max(...yValues)

  const Front = (
    <div className="rounded-2xl bg-card/40 p-6 backdrop-blur-sm h-full transition-colors">
      <div className="mb-6 flex items-center justify-between">
        <h4 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          {xLabel} <span className="text-muted-foreground/50">vs</span> {yLabel}
        </h4>
        <Activity className="h-4 w-4 text-muted-foreground/50" />
      </div>
      <div className="relative h-48 w-full px-2">
        <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
          {[0, 25, 50, 75, 100].map((v) => (
            <g key={v}>
              <line x1={v} y1="0" x2={v} y2="100" stroke="currentColor" strokeWidth="0.2" className="text-muted-foreground/20" strokeDasharray="2 2" />
              <line x1="0" y1={v} x2="100" y2={v} stroke="currentColor" strokeWidth="0.2" className="text-muted-foreground/20" strokeDasharray="2 2" />
            </g>
          ))}
          {data.map((point) => {
            const x = ((point.x - xMin) / (xMax - xMin || 1)) * 90 + 5
            const y = 95 - ((point.y - yMin) / (yMax - yMin || 1)) * 90
            return (
              <g key={point.state} className="group/point">
                <circle cx={x} cy={y} r="3" fill="var(--primary)" fillOpacity="0.6" className="cursor-pointer transition-all hover:r-5 hover:fill-opacity-100" onClick={() => onPointClick?.(point.state)} />
                <circle cx={x} cy={y} r="8" fill="transparent" className="cursor-pointer" onClick={() => onPointClick?.(point.state)} />
                <foreignObject x={x - 20} y={y - 15} width="40" height="20" className="opacity-0 group-hover/point:opacity-100 transition-opacity pointer-events-none">
                  <div className="text-[6px] text-center bg-popover text-popover-foreground rounded px-1 py-0.5 whitespace-nowrap">{point.state}</div>
                </foreignObject>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )

  return <FlipContainer front={Front} back={<CardBack explanation={explanation} />} />
}

function BentoHeatmap({ data, explanation }: { data: HeatmapCell[], explanation: { title: string; description: string; details: string } }) {
  const states = [...new Set(data.map((d) => d.state))]
  const months = [...new Set(data.map((d) => d.month))]
  const values = data.map((d) => d.value)
  const min = Math.min(...values)
  const max = Math.max(...values)

  const getColor = (value: number) => {
    const intensity = (value - min) / (max - min || 1)
    if (intensity < 0.33) return 'bg-emerald-500/80 saturate-150'
    if (intensity < 0.66) return 'bg-blue-500/80 saturate-150'
    return 'bg-amber-500/80 saturate-150'
  }

  const Front = (
    <div className="h-full rounded-2xl bg-card/40 p-6 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          Geographic Stress Heatmap (MSI)
        </h4>
        <div className="flex gap-2 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-xs bg-emerald-500/80"></div> Low</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-xs bg-blue-500/80"></div> Med</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-xs bg-amber-500/80"></div> High</span>
        </div>
      </div>
      <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted">
        <table className="w-full min-w-[600px] border-separate border-spacing-1">
          <thead>
            <tr>
              <th className="p-1 text-left text-[10px] font-medium text-muted-foreground w-32" />
              {months.map((month) => (
                <th key={month} className="p-1 text-center text-[10px] font-medium text-muted-foreground">
                  {month}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {states.map((state) => (
              <tr key={state} className="group">
                <td className="p-1 text-[11px] font-medium text-muted-foreground group-hover:text-primary transition-colors">
                  {state}
                </td>
                {months.map((month) => {
                  const cell = data.find((d) => d.state === state && d.month === month)
                  return (
                    <td key={month} className="p-0">
                      <div
                        className={`h-8 w-full rounded-sm transition-all hover:scale-105 hover:brightness-110 ${getColor(cell?.value || 0)}`}
                        title={`${state} ${month}: ${cell?.value.toFixed(2)}`}
                      />
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  return <FlipContainer front={Front} className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4" back={<CardBack explanation={explanation} />} />
}


// Styled Table
function PremiumTable({
  data,
  onStateClick,
}: {
  data: StateIndex[]
  onStateClick?: (stateId: string) => void
}) {
  return (
    <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 overflow-hidden rounded-2xl bg-card/40 backdrop-blur-sm">
      <div className="border-b border-white/5 bg-muted/20 px-6 py-4 flex items-center justify-between">
        <h3 className="font-semibold text-foreground">State Performance Matrix</h3>
        <div className="flex gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Good</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Average</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500"></div> Poor</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="px-6 py-4">State</th>
              <th className="px-6 py-4 text-right">MSI Score</th>
              <th className="px-6 py-4 text-right">Friction</th>
              <th className="px-6 py-4 text-right">Update Lag</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {data.map((row) => (
              <tr
                key={row.state}
                className="group cursor-pointer transition-colors hover:bg-muted/40"
                onClick={() => onStateClick?.(row.state)}
              >
                <td className="px-6 py-4">
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors">{row.name}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className={`font-mono font-medium ${row.msi > 1 ? 'text-amber-500' : 'text-foreground'}`}>
                    {row.msi.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-mono text-muted-foreground">
                    {row.friction.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${Math.min(100, (row.lag / 12) * 100)}%` }} />
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">{row.lag.toFixed(1)}m</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground/50 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


// Main Component
export function ExpertAnalytics({
  metricOptions,
  selectedMetricId,
  timeSeriesData,
  correlationData,
  heatmapData,
  nationalIndices,
  stateIndices,
  anomalies,
  // indexExplanations, // Using internal new explanations for cards
  onMetricChange,
  onAnomalyClick,
  onExport,
  onStateClick,
}: ExpertAnalyticsProps) {

  // Removed selectedMetric state and handleMetricChange as per instruction 1.

  // Define contents for the 3 index cards
  const cards = [
    {
      id: "msi",
      title: "Migration Stress Index",
      value: nationalIndices.migrationStressIndex.current,
      previous: nationalIndices.migrationStressIndex.previous,
      trend: nationalIndices.migrationStressIndex.trend,
      percentile: nationalIndices.migrationStressIndex.percentile,
      icon: AlertTriangle,
      explanation: {
        title: "Migration Stress Index (MSI)",
        description: "Ratio of address updates to fresh enrolments.",
        details: "Values above 1.0 indicate high population mobility. This helps track where people are moving to vs where they are born.",
      }
    },
    {
      id: "friction",
      title: "Admin Friction Score",
      value: nationalIndices.adminFrictionScore.current,
      previous: nationalIndices.adminFrictionScore.previous,
      trend: nationalIndices.adminFrictionScore.trend,
      percentile: nationalIndices.adminFrictionScore.percentile,
      icon: Activity,
      explanation: {
        title: "Administrative Friction",
        description: "Efficiency of the update process.",
        details: "A lower score is better. It measures the time and effort (failures, rejections) needed to successfully update an Aadhaar detail.",
      }
    },
    {
      id: "lag",
      title: "Biometric Update Lag",
      value: nationalIndices.biometricUpdateLag.current,
      previous: nationalIndices.biometricUpdateLag.previous,
      trend: nationalIndices.biometricUpdateLag.trend,
      percentile: nationalIndices.biometricUpdateLag.percentile,
      icon: Clock,
      explanation: {
        title: "Biometric Update Lag",
        description: "Delay in mandatory updates.",
        details: "Average time (in months) that residents are delaying their mandatory 5/15 year biometric updates. Target is < 3 months.",
      }
    }
  ]

  // Generic Explanations for Charts
  const chartExplanations = {
    enrolment: {
      title: "Enrolment Trends",
      description: "Monthly fresh Aadhaar generation.",
      details: "Monitors the saturation speed of the Aadhaar system. A declining trend suggests near-saturation in the adult population."
    },
    biometric: {
      title: "Biometric Updates",
      description: "Updates to fingerprint/iris data.",
      details: "Spikes often correlate with mandatory age-based updates (5/15 years). Consistent low activity may indicate poor field camp coverage."
    },
    demographic: {
      title: "Demographic Updates",
      description: "Changes to Name, Address, DOB.",
      details: "High volume often precedes local elections or follows major migration events/disasters."
    },
    scatter1: {
      title: "Growth vs Maintenance",
      description: "Fresh Enrolments vs Corrections.",
      details: "States in top-right are expanding AND correcting actively. Top-left suggests high migration (maintenance) but low fresh growth."
    },
    scatter2: {
      title: "Stress vs Efficiency",
      description: "Migration Stress vs System Friction.",
      details: "Target quadrant is Bottom-Left (Low Stress, High Efficiency). Top-Right indicates a system struggling with high update volume."
    },
    heatmap: {
      title: "Geographic Stress Heatmap",
      description: "Regional intensity of updates.",
      details: "Darker zones indicate high MSI (Migration Stress). This helps allocate field resources to high-demand districts."
    },
    anomalies: {
      title: "System Anomalies",
      description: "AI-detected irregularities.",
      details: "These flags indicate potential fraud rings, device malfunctions, or sudden demographic shifts requiring immediate admin attention."
    }
  }

  return (
    <div className="h-full w-full overflow-y-auto bg-background text-foreground pb-20">

      {/* Background Ambient Lights using Theme Vars */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 h-[800px] w-[800px] -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[600px] w-[600px] translate-y-1/3 rounded-full bg-accent/5 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] p-6 lg:p-10 space-y-10 pt-24">
        {/* Header Section */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-3">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Live Intelligence Layer
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Expert Analytics
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Deep analysis of identity patterns, migration trends, and system efficiency markers across the nation.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Removed Metric Selector / Select element */}
            <button
              onClick={onExport}
              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-95"
            >
              <Download className="h-4 w-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Main Grid Layout - Split: Left (Main Content) | Right (Anomalies Sidebar) */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">

          {/* Left Column: Analytics Content (Span 3) */}
          <div className="xl:col-span-3 space-y-6">

            {/* 1. Key Indices Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cards.map((card) => (
                <div key={card.id} className="h-48">
                  <BentoFlipCard
                    title={card.title}
                    value={card.value}
                    trend={card.trend}
                    percentile={card.percentile}
                    icon={card.icon}
                    explanation={card.explanation}
                    trendValues={{ current: card.value, previous: card.previous }}
                    className="h-full"
                  />
                </div>
              ))}
            </div>

            {/* 2. Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-[320px]">
                <BentoLineChart
                  data={timeSeriesData.enrolments}
                  label="Enrolment Trend"
                  color="#ec4899" // Pink-500
                  explanation={chartExplanations.enrolment}
                />
              </div>
              <div className="h-[320px]">
                <BentoLineChart
                  data={timeSeriesData.biometricUpdates}
                  label="Biometric Updates"
                  color="#d946ef" // Fuchsia-500
                  explanation={chartExplanations.biometric}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-[320px]">
                <BentoLineChart
                  data={timeSeriesData.demographicUpdates}
                  label="Demographic Updates"
                  color="#be185d" // Pink-700
                  explanation={chartExplanations.demographic}
                />
              </div>
              <div className="h-[320px]">
                <BentoScatterPlot
                  data={correlationData.enrolmentVsDemographic}
                  xLabel="Enrolments"
                  yLabel="Demo. Updates"
                  onPointClick={onStateClick}
                  explanation={chartExplanations.scatter1}
                />
              </div>
            </div>

            {/* Correcting Grid for remaining items */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="col-span-1 lg:col-span-2 h-[320px]">
                <BentoScatterPlot
                  data={correlationData.msiVsFriction}
                  xLabel="MSI"
                  yLabel="Friction Score"
                  onPointClick={onStateClick}
                  explanation={chartExplanations.scatter2}
                />
              </div>
            </div>

            {/* 3. Heatmap */}
            <BentoHeatmap
              data={heatmapData.stateByMonth}
              explanation={chartExplanations.heatmap}
            />

            {/* 4. Table - No fixed height, shows all logic */}
            <PremiumTable data={stateIndices} onStateClick={onStateClick} />

          </div>

          {/* Right Column: Anomalies Sidebar (Span 1) */}
          <div className="xl:col-span-1">
            <FlipContainer
              front={
                <div className="h-auto min-h-screen rounded-2xl bg-gradient-to-b from-card/40 to-destructive/5 p-6 backdrop-blur-sm flex flex-col cursor-pointer transition-all hover:shadow-xl hover:shadow-destructive/10">
                  <div className="flex items-center justify-between mb-6 flex-shrink-0 sticky top-0 bg-transparent z-10 pb-2 border-b border-border/10">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <Bell className="h-5 w-5 text-destructive" />
                      System Anomalies
                    </h3>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
                      {anomalies.length}
                    </span>
                  </div>
                  <div className="flex-1 space-y-3">
                    {anomalies.map(a => (
                      <div key={a.id} className="group/item relative rounded-lg bg-background/40 hover:bg-background/80 p-4 text-sm hover:ring-1 hover:ring-destructive/30 transition-all cursor-pointer shadow-sm" onClick={(e) => { e.stopPropagation(); onAnomalyClick?.(a.id) }}>
                        <div className="flex justify-between items-start font-medium text-foreground mb-1">
                          <span>{a.stateName}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${String(a.severity).toUpperCase() === 'HIGH' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                            String(a.severity).toUpperCase() === 'MEDIUM' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                              'bg-blue-500/10 text-blue-500 border-blue-500/20'
                            } uppercase tracking-wider`}>{a.severity}</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed group-hover/item:text-foreground/80">{a.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              }
              back={<CardBack explanation={chartExplanations.anomalies} />}
              className="h-full"
            />
          </div>

        </div>
      </div>
    </div>
  )
}
