// =============================================================================
// Data Types
// =============================================================================

export type TrendDirection = 'up' | 'down' | 'stable'
export type AnomalySeverity = 'low' | 'medium' | 'high'

export interface MetricOption {
  id: string
  label: string
  description: string
}

export interface TimeSeriesPoint {
  date: string
  value: number
}

export interface TimeSeriesData {
  enrolments: TimeSeriesPoint[]
  demographicUpdates: TimeSeriesPoint[]
  biometricUpdates: TimeSeriesPoint[]
}

export interface CorrelationPoint {
  state: string
  x: number
  y: number
  label: string
}

export interface CorrelationData {
  enrolmentVsDemographic: CorrelationPoint[]
  msiVsFriction: CorrelationPoint[]
}

export interface HeatmapCell {
  state: string
  month: string
  value: number
}

export interface HeatmapData {
  stateByMonth: HeatmapCell[]
}

export interface NationalIndex {
  current: number
  previous: number
  trend: TrendDirection
  percentile: number
}

export interface NationalIndices {
  migrationStressIndex: NationalIndex
  adminFrictionScore: NationalIndex
  biometricUpdateLag: NationalIndex
}

export interface StateIndex {
  state: string
  name: string
  msi: number
  friction: number
  lag: number
  msiTrend: TrendDirection
  frictionTrend: TrendDirection
  lagTrend: TrendDirection
}

export interface Anomaly {
  id: string
  stateId: string
  stateName: string
  districtId: string | null
  districtName: string | null
  severity: AnomalySeverity
  metric: string
  value: number
  threshold: number
  reasonCode: string
  explanation: string
  detectedAt: string
}

export interface IndexExplanation {
  whatItIs: string
  whyItMatters: string
  howToInterpret: string
}

export interface IndexExplanations {
  migrationStressIndex: IndexExplanation
  adminFrictionScore: IndexExplanation
  biometricUpdateLag: IndexExplanation
}

// =============================================================================
// Component Props
// =============================================================================

export interface ExpertAnalyticsProps {
  /** Available metrics for the selector */
  metricOptions: MetricOption[]
  /** Selected metric ID */
  selectedMetricId?: string
  /** Time series data for line charts */
  timeSeriesData: TimeSeriesData
  /** Correlation data for scatter plots */
  correlationData: CorrelationData
  /** Heatmap data for trivariate analysis */
  heatmapData: HeatmapData
  /** National-level derived indices */
  nationalIndices: NationalIndices
  /** State-level derived indices */
  stateIndices: StateIndex[]
  /** Detected anomalies */
  anomalies: Anomaly[]
  /** Explanations for each index */
  indexExplanations: IndexExplanations
  /** Called when user changes the selected metric */
  onMetricChange?: (metricId: string) => void
  /** Called when user clicks an anomaly to navigate to it */
  onAnomalyClick?: (anomalyId: string) => void
  /** Called when user clicks export PNG button */
  onExport?: () => void
  /** Called when user clicks a state in the charts */
  onStateClick?: (stateId: string) => void
}
