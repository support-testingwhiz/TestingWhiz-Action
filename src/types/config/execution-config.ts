/** Execution configuration for test execution settings */
export interface ExecutionConfig {
  /** Browser to use for execution */
  browser: string

  /** Capture screenshots on condition failure */
  captureConditionFailureScreenshot: boolean

  /** Capture screenshots on failure */
  captureFailureScreenshot: boolean

  /** Flag to enable or disable auto-healing */
  isAutoHealingEnabled: boolean

  /** Interval between steps */
  stepInterval?: number
}
