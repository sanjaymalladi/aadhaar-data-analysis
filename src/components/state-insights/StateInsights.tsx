'use client'

import type { StateInsightsProps, SparklinePoint, AgeGroupDistribution, District } from './types'
import { X, TrendingUp, TrendingDown, Minus, Users, FileText, Fingerprint, AlertTriangle, Activity, Clock, Info } from 'lucide-react'
import { useState } from 'react'

// Sparkline component
function Sparkline({ data, color = 'blue' }: { data: SparklinePoint[]; color?: string }) {
  if (!data.length) return null

  const values = data.map((d) => d.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * 100
      const y = 100 - ((d.value - min) / range) * 100
      return `${x},${y}`
    })
    .join(' ')

  const colorMap: Record<string, string> = {
    blue: '#3b82f6',
    amber: '#f59e0b',
    emerald: '#10b981',
  }

  return (
    <svg viewBox="0 0 100 40" className="h-8 w-full" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={colorMap[color] || colorMap.blue}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Stat card with sparkline and tooltip
function StatCard({
  title,
  value,
  rate,
  icon: Icon,
  sparklineData,
  color,
  tooltip,
}: {
  title: string
  value: number
  rate: number
  trend: SparklinePoint[]
  icon: React.ComponentType<{ className?: string }>
  sparklineData: SparklinePoint[]
  color: string
  tooltip?: string
}) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div
      className="group relative rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 transition-all hover:border-blue-500/30"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {tooltip && showTooltip && (
        <div className="absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-lg bg-slate-900 p-3 text-sm text-slate-300 shadow-xl">
          {tooltip}
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-6 border-transparent border-t-slate-900" />
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {title}
          </span>
          {tooltip && (
            <Info className="h-3 w-3 text-slate-500 opacity-0 transition-opacity group-hover:opacity-100" />
          )}
        </div>
        <span className={`font-mono text-xs ${rate >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {rate > 0 ? '+' : ''}{rate.toFixed(1)}%
        </span>
      </div>
      <p className="mt-2 font-mono text-2xl font-bold text-white">
        {(value / 1000000).toFixed(2)}M
      </p>
      <div className="mt-2">
        <Sparkline data={sparklineData} color={color} />
      </div>
    </div>
  )
}

// Health badge
function HealthBadge({ level }: { level: 'low' | 'medium' | 'high' }) {
  const config = {
    low: { label: 'Low Stress', bg: 'bg-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-400' },
    medium: { label: 'Medium Stress', bg: 'bg-amber-500/20', text: 'text-amber-400', dot: 'bg-amber-400' },
    high: { label: 'High Stress', bg: 'bg-red-500/20', text: 'text-red-400', dot: 'bg-red-400' },
  }
  const { label, bg, text, dot } = config[level]

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${bg} ${text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  )
}

// Age distribution chart
function AgeDistributionChart({ data }: { data: AgeGroupDistribution[] }) {
  const colors = ['#3b82f6', '#8b5cf6', '#10b981']

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
      <h4 className="mb-3 text-sm font-medium text-slate-300">
        Age Distribution
      </h4>
      <div className="space-y-3">
        {data.map((group, i) => (
          <div key={group.ageGroup}>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-slate-400">{group.ageGroup}</span>
              <span className="font-mono text-slate-500">{group.percentage}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-700">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${group.percentage}%`, backgroundColor: colors[i] }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Trend arrow component
function TrendArrow({ trend }: { trend: 'up' | 'down' | 'stable' }) {
  if (trend === 'up') return <TrendingUp className="h-4 w-4 text-amber-400" />
  if (trend === 'down') return <TrendingDown className="h-4 w-4 text-emerald-400" />
  return <Minus className="h-4 w-4 text-slate-500" />
}

// Derived index card (Expert mode)
function IndexCard({
  title,
  value,
  trend,
  percentile,
  icon: Icon,
  explanation,
}: {
  title: string
  value: number
  trend: 'up' | 'down' | 'stable'
  percentile: number
  icon: React.ComponentType<{ className?: string }>
  explanation: { whatItIs: string; whyItMatters: string; interpretation: string }
}) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div
      className="group relative rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 transition-all hover:border-blue-500/30"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 z-50 mb-2 w-72 -translate-x-1/2 rounded-lg bg-slate-900 p-4 text-sm shadow-xl">
          <p className="font-medium text-white">{title}</p>
          <p className="mt-1 text-slate-300">{explanation.whatItIs}</p>
          <p className="mt-2 text-xs text-slate-400">{explanation.whyItMatters}</p>
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-6 border-transparent border-t-slate-900" />
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-blue-500/20 p-1.5">
            <Icon className="h-4 w-4 text-blue-400" />
          </div>
          <span className="text-xs font-medium text-slate-300">{title}</span>
          <Info className="h-3 w-3 text-slate-500 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <TrendArrow trend={trend} />
      </div>
      <p className="mt-3 font-mono text-3xl font-bold text-white">
        {value.toFixed(2)}
      </p>
      <div className="mt-3">
        <div className="flex justify-between text-xs text-slate-500">
          <span>Percentile</span>
          <span className="font-mono">{percentile}%</span>
        </div>
        <div className="mt-1 h-1.5 rounded-full bg-slate-700">
          <div
            className="h-full rounded-full bg-blue-500"
            style={{ width: `${percentile}%` }}
          />
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-slate-400">
        {explanation.interpretation}
      </p>
    </div>
  )
}

// District heatmap (Expert mode)
function DistrictHeatmap({
  districts,
  onDistrictClick,
}: {
  districts: District[]
  onDistrictClick?: (id: string) => void
}) {
  const maxEnrolments = Math.max(...districts.map((d) => d.enrolments))

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
      <h4 className="mb-3 text-sm font-medium text-slate-300">
        District Heatmap
      </h4>
      <div className="grid grid-cols-4 gap-1.5">
        {districts.map((district) => {
          const intensity = district.enrolments / maxEnrolments
          const healthColor =
            district.healthIndicator === 'high'
              ? 'bg-amber-500'
              : district.healthIndicator === 'medium'
              ? 'bg-blue-500'
              : 'bg-emerald-500'

          return (
            <button
              key={district.id}
              onClick={() => onDistrictClick?.(district.id)}
              className={`aspect-square rounded-lg ${healthColor} transition-all hover:scale-105 hover:ring-2 hover:ring-white/50`}
              style={{ opacity: 0.4 + intensity * 0.6 }}
              title={`${district.name}: ${(district.enrolments / 1000000).toFixed(2)}M`}
            >
              <span className="sr-only">{district.name}</span>
            </button>
          )
        })}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>Lower activity</span>
        <div className="flex gap-1">
          <div className="h-2 w-6 rounded bg-blue-500/40" />
          <div className="h-2 w-6 rounded bg-blue-500/70" />
          <div className="h-2 w-6 rounded bg-blue-500" />
        </div>
        <span>Higher activity</span>
      </div>
    </div>
  )
}

// Tooltip explanations for stat cards
const STAT_TOOLTIPS = {
  enrolments: 'Total new Aadhaar registrations in this state. Growth rate shows month-over-month change.',
  demographic: 'Updates to address, name, or contact information. High rates may indicate population mobility.',
  biometric: 'Updates to fingerprints, iris, or photos. Required at ages 5 and 15.',
}

export function StateInsights({
  state,
  isOpen,
  isExpertMode = false,
  onClose,
  onDistrictClick,
}: StateInsightsProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto border-l border-slate-800 bg-slate-900 shadow-2xl sm:w-[420px]">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-900/95 px-6 py-4 backdrop-blur-sm">
          <div>
            <h2 className="text-xl font-bold text-white">
              {state.name}
            </h2>
            <div className="mt-2">
              <HealthBadge level={state.healthIndicator} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 p-6">
          {/* Summary stats */}
          <div className="grid gap-3">
            <StatCard
              title="Enrolments"
              value={state.summary.totalEnrolments}
              rate={state.summary.enrolmentRate}
              trend={state.enrolmentTrend}
              icon={Users}
              sparklineData={state.enrolmentTrend}
              color="blue"
              tooltip={STAT_TOOLTIPS.enrolments}
            />
            <StatCard
              title="Demographic Updates"
              value={state.summary.demographicUpdates}
              rate={state.summary.demographicRate}
              trend={state.demographicTrend}
              icon={FileText}
              sparklineData={state.demographicTrend}
              color="amber"
              tooltip={STAT_TOOLTIPS.demographic}
            />
            <StatCard
              title="Biometric Updates"
              value={state.summary.biometricUpdates}
              rate={state.summary.biometricRate}
              trend={state.biometricTrend}
              icon={Fingerprint}
              sparklineData={state.biometricTrend}
              color="emerald"
              tooltip={STAT_TOOLTIPS.biometric}
            />
          </div>

          {/* Age distribution */}
          <AgeDistributionChart data={state.ageDistribution} />

          {/* Expert mode content */}
          {isExpertMode && (
            <>
              <div className="border-t border-slate-800 pt-4">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-300">
                  <Activity className="h-4 w-4 text-blue-400" />
                  Derived Indices
                </h3>
                <div className="space-y-3">
                  <IndexCard
                    title="Migration Stress Index"
                    value={state.derivedIndices.migrationStressIndex.value}
                    trend={state.derivedIndices.migrationStressIndex.trend}
                    percentile={state.derivedIndices.migrationStressIndex.percentile}
                    icon={AlertTriangle}
                    explanation={state.derivedIndices.migrationStressIndex.explanation}
                  />
                  <IndexCard
                    title="Admin Friction Score"
                    value={state.derivedIndices.adminFrictionScore.value}
                    trend={state.derivedIndices.adminFrictionScore.trend}
                    percentile={state.derivedIndices.adminFrictionScore.percentile}
                    icon={Activity}
                    explanation={state.derivedIndices.adminFrictionScore.explanation}
                  />
                  <IndexCard
                    title="Biometric Update Lag"
                    value={state.derivedIndices.biometricUpdateLag.value}
                    trend={state.derivedIndices.biometricUpdateLag.trend}
                    percentile={state.derivedIndices.biometricUpdateLag.percentile}
                    icon={Clock}
                    explanation={state.derivedIndices.biometricUpdateLag.explanation}
                  />
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4">
                <DistrictHeatmap
                  districts={state.districts}
                  onDistrictClick={onDistrictClick}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
