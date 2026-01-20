'use client'

import { useState } from 'react'
import { AppShell } from '@/components/shell'
import { MapAndTimeline } from '@/components/map'
import { ExpertAnalytics } from '@/components/expert-analytics'
import {
  timePeriods,
  nationalSummary,
  ageGroupFlow,
  states,
  metricOptions,
  timeSeriesData,
  correlationData,
  heatmapData,
  nationalIndices,
  stateIndices,
  anomalies,
  indexExplanations,
} from '@/data/sample-data'

export default function Home() {
  // App mode: simple or expert
  const [mode, setMode] = useState<'simple' | 'expert'>('simple')

  // Selected time period
  const [selectedPeriodId, setSelectedPeriodId] = useState(timePeriods[timePeriods.length - 1].id)

  // Selected state for insights panel
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null)

  // Current user (mock)
  const user = { name: 'Admin User' }

  // Handle state click from map
  const handleStateClick = (stateId: string) => {
    setSelectedStateId(stateId)
  }

  // Handle closing the state insights panel
  const handleCloseInsights = () => {
    setSelectedStateId(null)
  }

  // Handle logout
  const handleLogout = () => {
    console.log('Logout clicked')
  }

  // Handle export
  const handleExport = () => {
    console.log('Export clicked')
  }

  // Show Expert Analytics page in expert mode when no state is selected
  const showExpertAnalytics = mode === 'expert' && !selectedStateId

  return (
    <AppShell
      mode={mode}
      onModeChange={setMode}
      user={user}
      onLogout={handleLogout}
    >
      {showExpertAnalytics ? (
        // Expert Analytics full-screen view
        <ExpertAnalytics
          metricOptions={metricOptions}
          selectedMetricId="enrolments"
          timeSeriesData={timeSeriesData}
          correlationData={correlationData}
          heatmapData={heatmapData}
          nationalIndices={nationalIndices}
          stateIndices={stateIndices}
          anomalies={anomalies}
          indexExplanations={indexExplanations}
          onMetricChange={(id) => console.log('Metric changed:', id)}
          onAnomalyClick={(id) => console.log('Anomaly clicked:', id)}
          onExport={handleExport}
          onStateClick={handleStateClick}
        />
      ) : (
        // Map and Timeline view (default)
        <MapAndTimeline
          timePeriods={timePeriods}
          selectedPeriodId={selectedPeriodId}
          nationalSummary={nationalSummary}
          ageGroupFlow={ageGroupFlow}
          states={states}
          onPeriodChange={setSelectedPeriodId}
          onStateClick={handleStateClick}
          onStateHover={(id) => { }}
          onPlayPause={(playing) => console.log('Playing:', playing)}
        />
      )}
    </AppShell>
  )
}
