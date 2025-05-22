/** Risk-based testing (RBT) configuration */
export interface RbtConfig {
  /** Whether label-based execution is enabled */
  labelExecutionEnabled: boolean

  /** Labels for execution */
  labels?: string

  /** High-priority tests */
  priorityHigh: boolean

  /** Low-priority tests */
  priorityLow: boolean

  /** Medium-priority tests */
  priorityMedium: boolean
}
