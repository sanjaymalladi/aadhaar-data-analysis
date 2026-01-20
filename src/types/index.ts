// =============================================================================
// Aadhaar Pulse — Data Model Types
// =============================================================================

// -----------------------------------------------------------------------------
// Common Types
// -----------------------------------------------------------------------------

export type HealthIndicator = 'low' | 'medium' | 'high'
export type TrendDirection = 'up' | 'down' | 'stable'
export type AnomalySeverity = 'low' | 'medium' | 'high'
export type AgeGroup = '0-5' | '5-17' | '18+'

// -----------------------------------------------------------------------------
// Geographic Entities
// -----------------------------------------------------------------------------

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

export interface District {
  id: string
  name: string
  stateId: string
  enrolments: number
  demographicUpdates: number
  biometricUpdates: number
  healthIndicator: HealthIndicator
}

// -----------------------------------------------------------------------------
// Time Periods
// -----------------------------------------------------------------------------

export interface TimePeriod {
  id: string
  label: string
  date: string
}

// -----------------------------------------------------------------------------
// Aggregated Metrics
// -----------------------------------------------------------------------------

export interface NationalSummary {
  period: string
  totalEnrolments: number
  demographicUpdates: number
  biometricUpdates: number
  enrolmentGrowth: number
  demographicGrowth: number
  biometricGrowth: number
}

export interface StateSummary {
  totalEnrolments: number
  demographicUpdates: number
  biometricUpdates: number
  enrolmentRate: number
  demographicRate: number
  biometricRate: number
}

// -----------------------------------------------------------------------------
// Age Group Flow (Sankey)
// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// Sparkline Data
// -----------------------------------------------------------------------------

export interface SparklinePoint {
  date: string
  value: number
}

export interface AgeGroupDistribution {
  ageGroup: AgeGroup
  count: number
  percentage: number
}

// -----------------------------------------------------------------------------
// Derived Indices
// -----------------------------------------------------------------------------

export interface IndexExplanation {
  whatItIs: string
  whyItMatters: string
  howToInterpret: string
}

export interface DerivedIndexValue {
  value: number
  trend: TrendDirection
  percentile: number
  explanation: IndexExplanation
}

export interface DerivedIndices {
  migrationStressIndex: DerivedIndexValue
  adminFrictionScore: DerivedIndexValue
  biometricUpdateLag: DerivedIndexValue
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

// -----------------------------------------------------------------------------
// State Detail (for State Insights panel)
// -----------------------------------------------------------------------------

export interface StateDetail {
  id: string
  name: string
  code: string
  healthIndicator: HealthIndicator
  summary: StateSummary
  ageDistribution: AgeGroupDistribution[]
  enrolmentTrend: SparklinePoint[]
  demographicTrend: SparklinePoint[]
  biometricTrend: SparklinePoint[]
  derivedIndices: DerivedIndices
  districts: District[]
}

// -----------------------------------------------------------------------------
// Anomaly Detection
// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// Analytics Data
// -----------------------------------------------------------------------------

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

export interface MetricOption {
  id: string
  label: string
  description: string
}

export interface IndexExplanations {
  migrationStressIndex: IndexExplanation
  adminFrictionScore: IndexExplanation
  biometricUpdateLag: IndexExplanation
}

// -----------------------------------------------------------------------------
// API Response Types
// -----------------------------------------------------------------------------

export interface DashboardData {
  timePeriods: TimePeriod[]
  currentPeriod: string
  nationalSummary: NationalSummary
  ageGroupFlow: AgeGroupFlow
  states: State[]
}

export interface AnalyticsData {
  metricOptions: MetricOption[]
  timeSeriesData: TimeSeriesData
  correlationData: CorrelationData
  heatmapData: HeatmapData
  nationalIndices: NationalIndices
  stateIndices: StateIndex[]
  anomalies: Anomaly[]
  indexExplanations: IndexExplanations
}
