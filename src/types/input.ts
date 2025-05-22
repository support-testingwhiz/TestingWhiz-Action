import { EmailConfig } from './config/email-config.js'
import { ExecutionConfig } from './config/execution-config.js'
import { RbtConfig } from './config/rbt-config.js'
import { ReportConfig } from './config/report-config.js'
import { ServerConfig } from './config/server-config.js'
import { TargetConfig } from './config/target-config.js'

// Main input configuration combining all sub-configurations
export interface Input {
  server: ServerConfig
  target: TargetConfig
  report: ReportConfig
  execution: ExecutionConfig
  email?: EmailConfig
  rbt: RbtConfig
}
