/** Target configuration for specifying test targets */
export interface TargetConfig {
  /** Path to the test file */
  filePath?: string

  /** Path to the folder containing test files */
  folderPath?: string

  /** Specific test case to run */
  testCase?: string

  /** Type of target (e.g., filePath, folderPath) */
  type: string
}
