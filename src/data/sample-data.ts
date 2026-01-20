import type { TimePeriod, NationalSummary, AgeGroupFlow, State } from '@/components/map'
import type { StateDetail } from '@/components/state-insights'
import type {
  MetricOption,
  TimeSeriesData,
  CorrelationData,
  HeatmapData,
  NationalIndices,
  StateIndex,
  Anomaly,
  IndexExplanations
} from '@/components/expert-analytics'

// Time periods for the timeline slider
export const timePeriods: TimePeriod[] = [
  { id: '2024-01', label: 'January 2024', date: '2024-01-01' },
  { id: '2024-02', label: 'February 2024', date: '2024-02-01' },
  { id: '2024-03', label: 'March 2024', date: '2024-03-01' },
  { id: '2024-04', label: 'April 2024', date: '2024-04-01' },
  { id: '2024-05', label: 'May 2024', date: '2024-05-01' },
  { id: '2024-06', label: 'June 2024', date: '2024-06-01' },
  { id: '2024-07', label: 'July 2024', date: '2024-07-01' },
  { id: '2024-08', label: 'August 2024', date: '2024-08-01' },
  { id: '2024-09', label: 'September 2024', date: '2024-09-01' },
  { id: '2024-10', label: 'October 2024', date: '2024-10-01' },
  { id: '2024-11', label: 'November 2024', date: '2024-11-01' },
  { id: '2024-12', label: 'December 2024', date: '2024-12-01' },
]

// National summary data
export const nationalSummary: NationalSummary = {
  totalEnrolments: 142857632,
  demographicUpdates: 89234521,
  biometricUpdates: 67123894,
  enrolmentGrowth: 3.2,
  demographicGrowth: 5.7,
  biometricGrowth: -1.4,
}

// Age group flow data for Sankey diagram
export const ageGroupFlow: AgeGroupFlow = {
  nodes: [
    { id: 'enrolled_0_5', label: 'Enrolled 0-5' },
    { id: 'enrolled_5_17', label: 'Enrolled 5-17' },
    { id: 'enrolled_18_plus', label: 'Enrolled 18+' },
    { id: 'updated_5_17', label: 'Updated 5-17' },
    { id: 'updated_18_plus', label: 'Updated 18+' },
  ],
  links: [
    { source: 'enrolled_0_5', target: 'updated_5_17', value: 12450000 },
    { source: 'enrolled_5_17', target: 'updated_5_17', value: 8920000 },
    { source: 'enrolled_5_17', target: 'updated_18_plus', value: 15670000 },
    { source: 'enrolled_18_plus', target: 'updated_18_plus', value: 42380000 },
  ],
}

// States data for the map
export const states: State[] = [
  { id: 'AP', name: 'Andhra Pradesh', code: 'AP', enrolments: 5234521, demographicUpdates: 3421098, biometricUpdates: 2156789, healthIndicator: 'low', centroid: [79.74, 15.91] },
  { id: 'AR', name: 'Arunachal Pradesh', code: 'AR', enrolments: 189432, demographicUpdates: 98234, biometricUpdates: 67123, healthIndicator: 'medium', centroid: [94.72, 28.21] },
  { id: 'AS', name: 'Assam', code: 'AS', enrolments: 3456789, demographicUpdates: 2134567, biometricUpdates: 1567890, healthIndicator: 'medium', centroid: [92.93, 26.20] },
  { id: 'BR', name: 'Bihar', code: 'BR', enrolments: 12345678, demographicUpdates: 7654321, biometricUpdates: 5432109, healthIndicator: 'high', centroid: [85.31, 25.09] },
  { id: 'CG', name: 'Chhattisgarh', code: 'CG', enrolments: 2876543, demographicUpdates: 1765432, biometricUpdates: 1234567, healthIndicator: 'low', centroid: [81.86, 21.27] },
  { id: 'GA', name: 'Goa', code: 'GA', enrolments: 198765, demographicUpdates: 123456, biometricUpdates: 87654, healthIndicator: 'low', centroid: [74.12, 15.29] },
  { id: 'GJ', name: 'Gujarat', code: 'GJ', enrolments: 6789012, demographicUpdates: 4567890, biometricUpdates: 3456789, healthIndicator: 'low', centroid: [71.19, 22.25] },
  { id: 'HR', name: 'Haryana', code: 'HR', enrolments: 2987654, demographicUpdates: 2098765, biometricUpdates: 1543210, healthIndicator: 'medium', centroid: [76.08, 29.05] },
  { id: 'HP', name: 'Himachal Pradesh', code: 'HP', enrolments: 876543, demographicUpdates: 543210, biometricUpdates: 321098, healthIndicator: 'low', centroid: [77.17, 31.10] },
  { id: 'JH', name: 'Jharkhand', code: 'JH', enrolments: 3654321, demographicUpdates: 2345678, biometricUpdates: 1765432, healthIndicator: 'high', centroid: [85.27, 23.61] },
  { id: 'KA', name: 'Karnataka', code: 'KA', enrolments: 6543210, demographicUpdates: 4321098, biometricUpdates: 3210987, healthIndicator: 'low', centroid: [75.71, 15.31] },
  { id: 'KL', name: 'Kerala', code: 'KL', enrolments: 3876543, demographicUpdates: 2654321, biometricUpdates: 1987654, healthIndicator: 'low', centroid: [76.27, 10.85] },
  { id: 'MP', name: 'Madhya Pradesh', code: 'MP', enrolments: 8765432, demographicUpdates: 5432109, biometricUpdates: 4321098, healthIndicator: 'medium', centroid: [78.65, 22.97] },
  { id: 'MH', name: 'Maharashtra', code: 'MH', enrolments: 12098765, demographicUpdates: 8765432, biometricUpdates: 6543210, healthIndicator: 'low', centroid: [75.71, 19.75] },
  { id: 'MN', name: 'Manipur', code: 'MN', enrolments: 345678, demographicUpdates: 234567, biometricUpdates: 156789, healthIndicator: 'medium', centroid: [93.90, 24.66] },
  { id: 'ML', name: 'Meghalaya', code: 'ML', enrolments: 432109, demographicUpdates: 287654, biometricUpdates: 198765, healthIndicator: 'medium', centroid: [91.36, 25.46] },
  { id: 'MZ', name: 'Mizoram', code: 'MZ', enrolments: 156789, demographicUpdates: 98765, biometricUpdates: 67890, healthIndicator: 'low', centroid: [92.93, 23.16] },
  { id: 'NL', name: 'Nagaland', code: 'NL', enrolments: 234567, demographicUpdates: 156789, biometricUpdates: 109876, healthIndicator: 'medium', centroid: [94.56, 26.15] },
  { id: 'OD', name: 'Odisha', code: 'OD', enrolments: 4567890, demographicUpdates: 3210987, biometricUpdates: 2345678, healthIndicator: 'medium', centroid: [85.09, 20.94] },
  { id: 'PB', name: 'Punjab', code: 'PB', enrolments: 3098765, demographicUpdates: 2109876, biometricUpdates: 1654321, healthIndicator: 'low', centroid: [75.34, 31.14] },
  { id: 'RJ', name: 'Rajasthan', code: 'RJ', enrolments: 7654321, demographicUpdates: 5109876, biometricUpdates: 3987654, healthIndicator: 'medium', centroid: [74.21, 27.02] },
  { id: 'SK', name: 'Sikkim', code: 'SK', enrolments: 87654, demographicUpdates: 54321, biometricUpdates: 32109, healthIndicator: 'low', centroid: [88.51, 27.53] },
  { id: 'TN', name: 'Tamil Nadu', code: 'TN', enrolments: 7890123, demographicUpdates: 5432109, biometricUpdates: 4098765, healthIndicator: 'low', centroid: [78.65, 11.12] },
  { id: 'TS', name: 'Telangana', code: 'TS', enrolments: 4098765, demographicUpdates: 2765432, biometricUpdates: 2109876, healthIndicator: 'low', centroid: [79.01, 18.11] },
  { id: 'TR', name: 'Tripura', code: 'TR', enrolments: 456789, demographicUpdates: 298765, biometricUpdates: 198765, healthIndicator: 'medium', centroid: [91.98, 23.94] },
  { id: 'UP', name: 'Uttar Pradesh', code: 'UP', enrolments: 21098765, demographicUpdates: 14567890, biometricUpdates: 10987654, healthIndicator: 'high', centroid: [80.94, 26.84] },
  { id: 'UK', name: 'Uttarakhand', code: 'UK', enrolments: 1234567, demographicUpdates: 876543, biometricUpdates: 654321, healthIndicator: 'low', centroid: [79.06, 30.06] },
  { id: 'WB', name: 'West Bengal', code: 'WB', enrolments: 9876543, demographicUpdates: 6543210, biometricUpdates: 4987654, healthIndicator: 'medium', centroid: [87.86, 22.98] },
  { id: 'DL', name: 'Delhi', code: 'DL', enrolments: 2109876, demographicUpdates: 1876543, biometricUpdates: 1234567, healthIndicator: 'medium', centroid: [77.10, 28.70] },
  { id: 'JK', name: 'Jammu and Kashmir', code: 'JK', enrolments: 1543210, demographicUpdates: 987654, biometricUpdates: 765432, healthIndicator: 'high', centroid: [74.79, 33.77] },
]

// State detail for the insights panel
export const getStateDetail = (stateId: string): StateDetail => {
  const state = states.find(s => s.id === stateId)
  if (!state) {
    // Return a default state
    return maharashtraDetail
  }

  // For now, return Maharashtra detail with the correct name
  return {
    ...maharashtraDetail,
    id: state.id,
    name: state.name,
    code: state.code,
    healthIndicator: state.healthIndicator,
    summary: {
      totalEnrolments: state.enrolments,
      demographicUpdates: state.demographicUpdates,
      biometricUpdates: state.biometricUpdates,
      enrolmentRate: 2.3 + Math.random() * 3,
      demographicRate: 4.1 + Math.random() * 2,
      biometricRate: 3.2 + Math.random() * 2,
    },
  }
}

const maharashtraDetail: StateDetail = {
  id: 'MH',
  name: 'Maharashtra',
  code: 'MH',
  healthIndicator: 'low',
  summary: {
    totalEnrolments: 12098765,
    demographicUpdates: 8765432,
    biometricUpdates: 6543210,
    enrolmentRate: 2.3,
    demographicRate: 4.1,
    biometricRate: 3.2,
  },
  ageDistribution: [
    { ageGroup: '0-5', count: 1812345, percentage: 15.0 },
    { ageGroup: '5-17', count: 3024691, percentage: 25.0 },
    { ageGroup: '18+', count: 7261729, percentage: 60.0 },
  ],
  enrolmentTrend: [
    { date: '2024-01', value: 980000 },
    { date: '2024-02', value: 1020000 },
    { date: '2024-03', value: 1050000 },
    { date: '2024-04', value: 990000 },
    { date: '2024-05', value: 1080000 },
    { date: '2024-06', value: 1100000 },
    { date: '2024-07', value: 1020000 },
    { date: '2024-08', value: 1060000 },
    { date: '2024-09', value: 1090000 },
    { date: '2024-10', value: 1120000 },
    { date: '2024-11', value: 1080000 },
    { date: '2024-12', value: 1050000 },
  ],
  demographicTrend: [
    { date: '2024-01', value: 720000 },
    { date: '2024-02', value: 735000 },
    { date: '2024-03', value: 760000 },
    { date: '2024-04', value: 745000 },
    { date: '2024-05', value: 780000 },
    { date: '2024-06', value: 795000 },
    { date: '2024-07', value: 810000 },
    { date: '2024-08', value: 790000 },
    { date: '2024-09', value: 825000 },
    { date: '2024-10', value: 840000 },
    { date: '2024-11', value: 820000 },
    { date: '2024-12', value: 805000 },
  ],
  biometricTrend: [
    { date: '2024-01', value: 540000 },
    { date: '2024-02', value: 555000 },
    { date: '2024-03', value: 560000 },
    { date: '2024-04', value: 545000 },
    { date: '2024-05', value: 570000 },
    { date: '2024-06', value: 580000 },
    { date: '2024-07', value: 590000 },
    { date: '2024-08', value: 575000 },
    { date: '2024-09', value: 595000 },
    { date: '2024-10', value: 610000 },
    { date: '2024-11', value: 600000 },
    { date: '2024-12', value: 585000 },
  ],
  derivedIndices: {
    migrationStressIndex: {
      value: 0.72,
      trend: 'stable',
      percentile: 35,
      explanation: {
        whatItIs: 'Ratio of address updates to fresh enrolments.',
        whyItMatters: 'High MSI indicates population mobility or seasonal migration patterns.',
        interpretation: 'Maharashtra shows moderate migration stress, typical for a state with major urban centers attracting workers.',
      },
    },
    adminFrictionScore: {
      value: 0.18,
      trend: 'down',
      percentile: 22,
      explanation: {
        whatItIs: 'Ratio of update requests to successful completions, weighted by delays.',
        whyItMatters: 'High friction suggests bottlenecks in update processing infrastructure.',
        interpretation: 'Low friction score indicates efficient administrative processing across most districts.',
      },
    },
    biometricUpdateLag: {
      value: 4.2,
      trend: 'up',
      percentile: 45,
      explanation: {
        whatItIs: 'Average months between mandatory update triggers and actual completions.',
        whyItMatters: 'High lag indicates accessibility or awareness issues for biometric updates.',
        interpretation: 'Slight increase in lag, possibly due to increased demand in urban centers.',
      },
    },
  },
  districts: [
    { id: 'MH-MUM', name: 'Mumbai', enrolments: 2156789, demographicUpdates: 1567890, biometricUpdates: 1234567, healthIndicator: 'low' },
    { id: 'MH-PUN', name: 'Pune', enrolments: 1876543, demographicUpdates: 1345678, biometricUpdates: 1098765, healthIndicator: 'low' },
    { id: 'MH-NAG', name: 'Nagpur', enrolments: 1234567, demographicUpdates: 876543, biometricUpdates: 654321, healthIndicator: 'medium' },
    { id: 'MH-THA', name: 'Thane', enrolments: 1654321, demographicUpdates: 1123456, biometricUpdates: 876543, healthIndicator: 'low' },
    { id: 'MH-NAS', name: 'Nashik', enrolments: 987654, demographicUpdates: 654321, biometricUpdates: 432109, healthIndicator: 'medium' },
    { id: 'MH-AUR', name: 'Aurangabad', enrolments: 876543, demographicUpdates: 567890, biometricUpdates: 345678, healthIndicator: 'high' },
    { id: 'MH-SOL', name: 'Solapur', enrolments: 654321, demographicUpdates: 432109, biometricUpdates: 234567, healthIndicator: 'medium' },
    { id: 'MH-KOL', name: 'Kolhapur', enrolments: 543210, demographicUpdates: 345678, biometricUpdates: 198765, healthIndicator: 'low' },
  ],
}

// Expert Analytics data
export const metricOptions: MetricOption[] = [
  { id: 'enrolments', label: 'Total Enrolments', description: 'New Aadhaar registrations' },
  { id: 'demographicUpdates', label: 'Demographic Updates', description: 'Address, name, DOB changes' },
  { id: 'biometricUpdates', label: 'Biometric Updates', description: 'Fingerprint, iris, photo updates' },
  { id: 'msi', label: 'Migration Stress Index', description: 'Address updates vs enrolments ratio' },
  { id: 'friction', label: 'Friction Score', description: 'Update processing efficiency' },
  { id: 'updateLag', label: 'Biometric Update Lag', description: 'Delay in mandatory updates' },
]

export const timeSeriesData: TimeSeriesData = {
  enrolments: [
    { date: '2024-01', value: 11234567 },
    { date: '2024-02', value: 11567890 },
    { date: '2024-03', value: 11890123 },
    { date: '2024-04', value: 11345678 },
    { date: '2024-05', value: 12098765 },
    { date: '2024-06', value: 12345678 },
    { date: '2024-07', value: 11987654 },
    { date: '2024-08', value: 12234567 },
    { date: '2024-09', value: 12567890 },
    { date: '2024-10', value: 12890123 },
    { date: '2024-11', value: 12543210 },
    { date: '2024-12', value: 12098765 },
  ],
  demographicUpdates: [
    { date: '2024-01', value: 7123456 },
    { date: '2024-02', value: 7345678 },
    { date: '2024-03', value: 7567890 },
    { date: '2024-04', value: 7234567 },
    { date: '2024-05', value: 7890123 },
    { date: '2024-06', value: 8123456 },
    { date: '2024-07', value: 8345678 },
    { date: '2024-08', value: 8098765 },
    { date: '2024-09', value: 8567890 },
    { date: '2024-10', value: 8890123 },
    { date: '2024-11', value: 8654321 },
    { date: '2024-12', value: 8234567 },
  ],
  biometricUpdates: [
    { date: '2024-01', value: 5432109 },
    { date: '2024-02', value: 5567890 },
    { date: '2024-03', value: 5678901 },
    { date: '2024-04', value: 5345678 },
    { date: '2024-05', value: 5890123 },
    { date: '2024-06', value: 6012345 },
    { date: '2024-07', value: 6123456 },
    { date: '2024-08', value: 5987654 },
    { date: '2024-09', value: 6234567 },
    { date: '2024-10', value: 6456789 },
    { date: '2024-11', value: 6321098 },
    { date: '2024-12', value: 6098765 },
  ],
}

export const correlationData: CorrelationData = {
  enrolmentVsDemographic: [
    { state: 'UP', x: 21098765, y: 14567890, label: 'Uttar Pradesh' },
    { state: 'MH', x: 12098765, y: 8765432, label: 'Maharashtra' },
    { state: 'BR', x: 12345678, y: 7654321, label: 'Bihar' },
    { state: 'WB', x: 9876543, y: 6543210, label: 'West Bengal' },
    { state: 'MP', x: 8765432, y: 5432109, label: 'Madhya Pradesh' },
    { state: 'TN', x: 7890123, y: 5432109, label: 'Tamil Nadu' },
    { state: 'RJ', x: 7654321, y: 5109876, label: 'Rajasthan' },
    { state: 'GJ', x: 6789012, y: 4567890, label: 'Gujarat' },
    { state: 'KA', x: 6543210, y: 4321098, label: 'Karnataka' },
    { state: 'AP', x: 5234521, y: 3421098, label: 'Andhra Pradesh' },
  ],
  msiVsFriction: [
    { state: 'UP', x: 1.24, y: 0.32, label: 'Uttar Pradesh' },
    { state: 'BR', x: 1.18, y: 0.45, label: 'Bihar' },
    { state: 'JH', x: 1.12, y: 0.38, label: 'Jharkhand' },
    { state: 'JK', x: 0.98, y: 0.52, label: 'Jammu and Kashmir' },
    { state: 'MH', x: 0.72, y: 0.18, label: 'Maharashtra' },
    { state: 'KA', x: 0.66, y: 0.15, label: 'Karnataka' },
    { state: 'TN', x: 0.69, y: 0.12, label: 'Tamil Nadu' },
    { state: 'KL', x: 0.68, y: 0.08, label: 'Kerala' },
    { state: 'GJ', x: 0.67, y: 0.14, label: 'Gujarat' },
    { state: 'DL', x: 0.89, y: 0.28, label: 'Delhi' },
  ],
}

export const heatmapData: HeatmapData = {
  stateByMonth: [
    { state: 'UP', month: 'Jan', value: 1.24 },
    { state: 'UP', month: 'Feb', value: 1.28 },
    { state: 'UP', month: 'Mar', value: 1.31 },
    { state: 'UP', month: 'Apr', value: 1.19 },
    { state: 'UP', month: 'May', value: 1.22 },
    { state: 'UP', month: 'Jun', value: 1.26 },
    { state: 'BR', month: 'Jan', value: 1.15 },
    { state: 'BR', month: 'Feb', value: 1.21 },
    { state: 'BR', month: 'Mar', value: 1.25 },
    { state: 'BR', month: 'Apr', value: 1.12 },
    { state: 'BR', month: 'May', value: 1.18 },
    { state: 'BR', month: 'Jun', value: 1.22 },
    { state: 'MH', month: 'Jan', value: 0.68 },
    { state: 'MH', month: 'Feb', value: 0.71 },
    { state: 'MH', month: 'Mar', value: 0.74 },
    { state: 'MH', month: 'Apr', value: 0.69 },
    { state: 'MH', month: 'May', value: 0.72 },
    { state: 'MH', month: 'Jun', value: 0.75 },
    { state: 'KA', month: 'Jan', value: 0.62 },
    { state: 'KA', month: 'Feb', value: 0.65 },
    { state: 'KA', month: 'Mar', value: 0.68 },
    { state: 'KA', month: 'Apr', value: 0.64 },
    { state: 'KA', month: 'May', value: 0.66 },
    { state: 'KA', month: 'Jun', value: 0.69 },
    { state: 'TN', month: 'Jan', value: 0.65 },
    { state: 'TN', month: 'Feb', value: 0.68 },
    { state: 'TN', month: 'Mar', value: 0.71 },
    { state: 'TN', month: 'Apr', value: 0.67 },
    { state: 'TN', month: 'May', value: 0.69 },
    { state: 'TN', month: 'Jun', value: 0.72 },
  ],
}

export const nationalIndices: NationalIndices = {
  migrationStressIndex: {
    current: 0.85,
    previous: 0.82,
    trend: 'up',
    percentile: 50,
  },
  adminFrictionScore: {
    current: 0.24,
    previous: 0.26,
    trend: 'down',
    percentile: 50,
  },
  biometricUpdateLag: {
    current: 5.2,
    previous: 5.0,
    trend: 'up',
    percentile: 50,
  },
}

export const stateIndices: StateIndex[] = [
  { state: 'UP', name: 'Uttar Pradesh', msi: 1.24, friction: 0.32, lag: 7.8, msiTrend: 'up', frictionTrend: 'stable', lagTrend: 'up' },
  { state: 'BR', name: 'Bihar', msi: 1.18, friction: 0.45, lag: 8.2, msiTrend: 'up', frictionTrend: 'up', lagTrend: 'up' },
  { state: 'JH', name: 'Jharkhand', msi: 1.12, friction: 0.38, lag: 6.9, msiTrend: 'stable', frictionTrend: 'down', lagTrend: 'up' },
  { state: 'JK', name: 'Jammu and Kashmir', msi: 0.98, friction: 0.52, lag: 9.1, msiTrend: 'down', frictionTrend: 'up', lagTrend: 'up' },
  { state: 'MH', name: 'Maharashtra', msi: 0.72, friction: 0.18, lag: 4.2, msiTrend: 'stable', frictionTrend: 'down', lagTrend: 'stable' },
  { state: 'KA', name: 'Karnataka', msi: 0.66, friction: 0.15, lag: 3.8, msiTrend: 'down', frictionTrend: 'down', lagTrend: 'down' },
  { state: 'TN', name: 'Tamil Nadu', msi: 0.69, friction: 0.12, lag: 3.5, msiTrend: 'stable', frictionTrend: 'down', lagTrend: 'down' },
  { state: 'KL', name: 'Kerala', msi: 0.68, friction: 0.08, lag: 2.9, msiTrend: 'stable', frictionTrend: 'stable', lagTrend: 'down' },
  { state: 'GJ', name: 'Gujarat', msi: 0.67, friction: 0.14, lag: 4.1, msiTrend: 'down', frictionTrend: 'down', lagTrend: 'stable' },
  { state: 'DL', name: 'Delhi', msi: 0.89, friction: 0.28, lag: 5.4, msiTrend: 'up', frictionTrend: 'stable', lagTrend: 'up' },
]

export const anomalies: Anomaly[] = [
  {
    id: 'anom-001',
    stateId: 'BR',
    stateName: 'Bihar',
    districtId: 'BR-MUZ',
    districtName: 'Muzaffarpur',
    severity: 'high',
    metric: 'biometricUpdateLag',
    value: 12.4,
    threshold: 8.0,
    reasonCode: 'LAG_SPIKE',
    explanation: 'Biometric update lag spiked significantly above state average, possibly indicating infrastructure issues or seasonal migration return.',
    detectedAt: '2024-12-15',
  },
  {
    id: 'anom-002',
    stateId: 'UP',
    stateName: 'Uttar Pradesh',
    districtId: 'UP-LKO',
    districtName: 'Lucknow',
    severity: 'medium',
    metric: 'migrationStressIndex',
    value: 1.85,
    threshold: 1.5,
    reasonCode: 'MSI_ELEVATED',
    explanation: 'High ratio of address updates to fresh enrolments suggests significant in-migration, likely seasonal workers.',
    detectedAt: '2024-11-28',
  },
  {
    id: 'anom-003',
    stateId: 'JK',
    stateName: 'Jammu and Kashmir',
    districtId: 'JK-SRI',
    districtName: 'Srinagar',
    severity: 'high',
    metric: 'adminFrictionScore',
    value: 0.68,
    threshold: 0.5,
    reasonCode: 'FRICTION_HIGH',
    explanation: 'Update processing delays significantly above normal, may indicate administrative bottleneck or connectivity issues.',
    detectedAt: '2024-12-02',
  },
  {
    id: 'anom-004',
    stateId: 'WB',
    stateName: 'West Bengal',
    districtId: null,
    districtName: null,
    severity: 'low',
    metric: 'enrolmentDrop',
    value: -12.5,
    threshold: -10.0,
    reasonCode: 'ENROLMENT_DECLINE',
    explanation: 'Month-over-month enrolment decline exceeds typical seasonal variation, worth monitoring.',
    detectedAt: '2024-12-10',
  },
  {
    id: 'anom-005',
    stateId: 'RJ',
    stateName: 'Rajasthan',
    districtId: 'RJ-JDH',
    districtName: 'Jodhpur',
    severity: 'medium',
    metric: 'demographicSurge',
    value: 45.2,
    threshold: 30.0,
    reasonCode: 'DEMO_SURGE',
    explanation: 'Demographic updates surged well above normal, possibly indicating address corrections or data quality drive.',
    detectedAt: '2024-11-20',
  },
]

export const indexExplanations: IndexExplanations = {
  migrationStressIndex: {
    whatItIs: 'Ratio of address updates to fresh enrolments over a time period.',
    whyItMatters: 'High MSI indicates significant population mobility, which can signal seasonal migration, urbanization pressure, or economic displacement.',
    howToInterpret: 'Values above 1.0 mean more people are updating addresses than new people enrolling. Values above 1.2 warrant investigation.',
  },
  adminFrictionScore: {
    whatItIs: 'Ratio of update requests to successful completions, weighted by average processing time.',
    whyItMatters: 'High friction indicates bottlenecks in the update processing pipeline, which affects citizen experience and data freshness.',
    howToInterpret: 'Values below 0.2 indicate smooth processing. Values above 0.4 suggest systemic issues needing attention.',
  },
  biometricUpdateLag: {
    whatItIs: 'Average months between when a biometric update becomes mandatory (age transitions) and actual completion.',
    whyItMatters: 'High lag means citizens are not updating biometrics on time, which can cause authentication failures and service denial.',
    howToInterpret: 'Target is under 3 months. Values above 6 months indicate awareness or accessibility issues.',
  },
}
