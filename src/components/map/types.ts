// =============================================================================
// Data Types
// =============================================================================

export type HealthIndicator = 'low' | 'medium' | 'high'

export interface TimePeriod {
  id: string
  label: string
  date: string
}

export interface NationalSummary {
  totalEnrolments: number
  demographicUpdates: number
  biometricUpdates: number
  enrolmentGrowth: number
  demographicGrowth: number
  biometricGrowth: number
}

export interface SankeyNode {
  id: string
  label: string
}

export interface SankeyLink {
  source: string
  target: string
  value: number
}

export interface AgeGroupFlow {
  nodes: SankeyNode[]
  links: SankeyLink[]
}

export interface State {
  id: string
  name: string
  code: string
  enrolments: number
  demographicUpdates: number
  biometricUpdates: number
  healthIndicator: HealthIndicator
  centroid: [number, number]
}

// =============================================================================
// Component Props
// =============================================================================

export interface MapAndTimelineProps {
  /** Available time periods for the slider */
  timePeriods: TimePeriod[]
  /** Currently selected time period ID */
  selectedPeriodId?: string
  /** National summary metrics */
  nationalSummary: NationalSummary
  /** Age group flow data for Sankey diagram */
  ageGroupFlow: AgeGroupFlow
  /** All states with their metrics */
  states: State[]
  /** Called when user selects a different time period */
  onPeriodChange?: (periodId: string) => void
  /** Called when user clicks a state on the map */
  onStateClick?: (stateId: string) => void
  /** Called when user hovers over a state */
  onStateHover?: (stateId: string | null) => void
  /** Called when play/pause is toggled */
  onPlayPause?: (isPlaying: boolean) => void
}
