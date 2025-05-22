/** Report configuration for generating test reports */
export interface ReportConfig {
  /** Path to save the report */
  filePath: string

  /** Frequency of report generation */
  frequency: number

  /** Interval for report generation */
  interval: number

  /** Pass/fail threshold percentage */
  passFailPercentage: number

  /** Whether to generate PDF reports */
  pdfFormat: boolean

  /** Prefix for report files */
  prefix?: string

  /** Whether to generate ZIP reports */
  zipFormat: boolean
}
