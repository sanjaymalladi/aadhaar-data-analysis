/**
 * Data Processing Pipeline for Aadhaar Pulse
 *
 * This module provides functions to:
 * 1. Parse raw CSV data files
 * 2. Aggregate data by state and time period
 * 3. Calculate derived indices (MSI, Friction Score, Update Lag)
 * 4. Detect anomalies
 */

import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'

// Types for raw CSV data
interface RawEnrolmentRow {
  date: string
  state: string
  district: string
  pincode: string
  age_0_5: string
  age_5_17: string
  age_18_greater: string
}

interface RawUpdateRow {
  date: string
  state: string
  district: string
  pincode: string
  age_0_5: string
  age_5_17: string
  age_18_greater: string
}

// Aggregated data types
export interface StateAggregation {
  stateId: string
  stateName: string
  stateCode: string
  enrolments: number
  demographicUpdates: number
  biometricUpdates: number
  age0_5: number
  age5_17: number
  age18Plus: number
}

export interface MonthlyAggregation {
  month: string // YYYY-MM format
  states: Map<string, StateAggregation>
  national: {
    totalEnrolments: number
    demographicUpdates: number
    biometricUpdates: number
  }
}

// State code mappings
const stateCodeMap: Record<string, string> = {
  'Andhra Pradesh': 'AP',
  'Arunachal Pradesh': 'AR',
  'Assam': 'AS',
  'Bihar': 'BR',
  'Chhattisgarh': 'CG',
  'Goa': 'GA',
  'Gujarat': 'GJ',
  'Haryana': 'HR',
  'Himachal Pradesh': 'HP',
  'Jharkhand': 'JH',
  'Karnataka': 'KA',
  'Kerala': 'KL',
  'Madhya Pradesh': 'MP',
  'Maharashtra': 'MH',
  'Manipur': 'MN',
  'Meghalaya': 'ML',
  'Mizoram': 'MZ',
  'Nagaland': 'NL',
  'Odisha': 'OD',
  'Punjab': 'PB',
  'Rajasthan': 'RJ',
  'Sikkim': 'SK',
  'Tamil Nadu': 'TN',
  'Telangana': 'TS',
  'Tripura': 'TR',
  'Uttar Pradesh': 'UP',
  'Uttarakhand': 'UK',
  'West Bengal': 'WB',
  'Delhi': 'DL',
  'Jammu and Kashmir': 'JK',
  'Ladakh': 'LA',
  'Puducherry': 'PY',
  'Chandigarh': 'CH',
  'Andaman and Nicobar Islands': 'AN',
  'Dadra and Nagar Haveli and Daman and Diu': 'DN',
  'Lakshadweep': 'LD',
}

/**
 * Parse date from DD-MM-YYYY format to YYYY-MM format
 */
function parseMonth(dateStr: string): string {
  const parts = dateStr.split('-')
  if (parts.length === 3) {
    const [day, month, year] = parts
    return `${year}-${month.padStart(2, '0')}`
  }
  return dateStr
}

/**
 * Read and parse CSV files from a directory
 */
export function readCsvFiles(directory: string): RawEnrolmentRow[] {
  const files = fs.readdirSync(directory).filter(f => f.endsWith('.csv'))
  const allRows: RawEnrolmentRow[] = []

  for (const file of files) {
    const filePath = path.join(directory, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
    }) as RawEnrolmentRow[]
    allRows.push(...records)
  }

  return allRows
}

/**
 * Aggregate enrolment data by state and month
 */
export function aggregateByStateAndMonth(rows: RawEnrolmentRow[]): Map<string, MonthlyAggregation> {
  const monthlyData = new Map<string, MonthlyAggregation>()

  for (const row of rows) {
    const month = parseMonth(row.date)
    const stateName = row.state
    const stateCode = stateCodeMap[stateName] || stateName.substring(0, 2).toUpperCase()

    // Get or create monthly aggregation
    if (!monthlyData.has(month)) {
      monthlyData.set(month, {
        month,
        states: new Map(),
        national: {
          totalEnrolments: 0,
          demographicUpdates: 0,
          biometricUpdates: 0,
        },
      })
    }

    const monthAgg = monthlyData.get(month)!

    // Get or create state aggregation
    if (!monthAgg.states.has(stateCode)) {
      monthAgg.states.set(stateCode, {
        stateId: stateCode,
        stateName,
        stateCode,
        enrolments: 0,
        demographicUpdates: 0,
        biometricUpdates: 0,
        age0_5: 0,
        age5_17: 0,
        age18Plus: 0,
      })
    }

    const stateAgg = monthAgg.states.get(stateCode)!

    // Aggregate numbers
    const age0_5 = parseInt(row.age_0_5) || 0
    const age5_17 = parseInt(row.age_5_17) || 0
    const age18Plus = parseInt(row.age_18_greater) || 0
    const total = age0_5 + age5_17 + age18Plus

    stateAgg.enrolments += total
    stateAgg.age0_5 += age0_5
    stateAgg.age5_17 += age5_17
    stateAgg.age18Plus += age18Plus

    // Update national totals
    monthAgg.national.totalEnrolments += total
  }

  return monthlyData
}

/**
 * Calculate derived indices for a state
 */
export function calculateDerivedIndices(
  enrolments: number,
  demographicUpdates: number,
  biometricUpdates: number
): {
  migrationStressIndex: number
  adminFrictionScore: number
  biometricUpdateLag: number
} {
  // Migration Stress Index: ratio of demographic updates to enrolments
  const msi = enrolments > 0 ? demographicUpdates / enrolments : 0

  // Admin Friction Score: inverse of completion rate (simplified)
  const totalUpdates = demographicUpdates + biometricUpdates
  const friction = totalUpdates > 0 ? 1 - (totalUpdates / (enrolments + totalUpdates)) : 0

  // Biometric Update Lag: ratio of expected to actual updates (simplified)
  const expectedBiometric = enrolments * 0.1 // Assume 10% should update biometrics
  const lag = expectedBiometric > 0 ? Math.max(0, (expectedBiometric - biometricUpdates) / expectedBiometric) * 12 : 0

  return {
    migrationStressIndex: Math.round(msi * 100) / 100,
    adminFrictionScore: Math.round(friction * 100) / 100,
    biometricUpdateLag: Math.round(lag * 10) / 10,
  }
}

/**
 * Determine health indicator based on derived indices
 */
export function determineHealthIndicator(msi: number, friction: number, lag: number): 'low' | 'medium' | 'high' {
  const score = (msi > 1 ? 2 : msi > 0.7 ? 1 : 0) +
                (friction > 0.4 ? 2 : friction > 0.2 ? 1 : 0) +
                (lag > 6 ? 2 : lag > 3 ? 1 : 0)

  if (score >= 4) return 'high'
  if (score >= 2) return 'medium'
  return 'low'
}

/**
 * Detect anomalies in the data
 */
export function detectAnomalies(
  currentMonth: MonthlyAggregation,
  previousMonth: MonthlyAggregation | null
): Array<{
  stateId: string
  stateName: string
  severity: 'low' | 'medium' | 'high'
  metric: string
  value: number
  threshold: number
  reasonCode: string
  explanation: string
}> {
  const anomalies: Array<{
    stateId: string
    stateName: string
    severity: 'low' | 'medium' | 'high'
    metric: string
    value: number
    threshold: number
    reasonCode: string
    explanation: string
  }> = []

  if (!previousMonth) return anomalies

  for (const [stateId, current] of currentMonth.states) {
    const previous = previousMonth.states.get(stateId)
    if (!previous) continue

    // Check for enrolment spikes/drops
    const enrolmentChange = previous.enrolments > 0
      ? ((current.enrolments - previous.enrolments) / previous.enrolments) * 100
      : 0

    if (Math.abs(enrolmentChange) > 30) {
      anomalies.push({
        stateId,
        stateName: current.stateName,
        severity: Math.abs(enrolmentChange) > 50 ? 'high' : 'medium',
        metric: enrolmentChange > 0 ? 'enrolmentSpike' : 'enrolmentDrop',
        value: Math.round(enrolmentChange * 10) / 10,
        threshold: 30,
        reasonCode: enrolmentChange > 0 ? 'ENROLMENT_SPIKE' : 'ENROLMENT_DROP',
        explanation: `Enrolment ${enrolmentChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(enrolmentChange).toFixed(1)}% compared to previous month.`,
      })
    }
  }

  return anomalies
}

/**
 * Main processing function to generate all app data
 */
export async function processAllData(dataDir: string): Promise<{
  states: StateAggregation[]
  monthlyData: MonthlyAggregation[]
  anomalies: ReturnType<typeof detectAnomalies>
}> {
  // Read enrolment data
  const enrolmentDir = path.join(dataDir, 'api_data_aadhar_enrolment')
  const enrolmentRows = readCsvFiles(enrolmentDir)

  // Aggregate by state and month
  const monthlyMap = aggregateByStateAndMonth(enrolmentRows)

  // Convert to array and sort by month
  const monthlyData = Array.from(monthlyMap.values()).sort((a, b) =>
    a.month.localeCompare(b.month)
  )

  // Get latest month's state data
  const latestMonth = monthlyData[monthlyData.length - 1]
  const states = latestMonth ? Array.from(latestMonth.states.values()) : []

  // Detect anomalies
  const previousMonth = monthlyData.length > 1 ? monthlyData[monthlyData.length - 2] : null
  const anomalies = latestMonth ? detectAnomalies(latestMonth, previousMonth) : []

  return {
    states,
    monthlyData,
    anomalies,
  }
}

// Export for use in API routes or build scripts
export default {
  readCsvFiles,
  aggregateByStateAndMonth,
  calculateDerivedIndices,
  determineHealthIndicator,
  detectAnomalies,
  processAllData,
}
