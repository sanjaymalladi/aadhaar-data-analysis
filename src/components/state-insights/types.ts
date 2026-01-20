// =============================================================================
// Data Types
// =============================================================================

export type HealthIndicator = 'low' | 'medium' | 'high'
export type TrendDirection = 'up' | 'down' | 'stable'

export interface SparklinePoint {
  date: string
  value: number
}

export interface AgeGroupDistribution {
  ageGroup: '0-5' | '5-17' | '18+'
  count: number
  percentage: number
}

export interface StateSummary {
  totalEnrolments: number
  demographicUpdates: number
  biometricUpdates: number
  enrolmentRate: number
  demographicRate: number
  biometricRate: number
}

export interface IndexExplanation {
  whatItIs: string
  whyItMatters: string
  interpretation: string
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

export interface District {
  id: string
  name: string
  enrolments: number
  demographicUpdates: number
  biometricUpdates: number
  healthIndicator: HealthIndicator
}

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

// =============================================================================
// Component Props
// =============================================================================

export interface StateInsightsProps {
  /** The selected state's detailed data */
  state: StateDetail
  /** Whether the panel is open */
  isOpen: boolean
  /** Whether Expert mode is enabled */
  isExpertMode?: boolean
  /** Called when user closes the panel */
  onClose?: () => void
  /** Called when user clicks a district in the heatmap */
  onDistrictClick?: (districtId: string) => void
}
