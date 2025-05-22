import { InputProvider } from '@/base/index.js'
import {
  Input,
  ServerConfig,
  TargetConfig,
  ReportConfig,
  ExecutionConfig,
  EmailConfig,
  RbtConfig
} from '@/types/index.js'
import { getInput, getBooleanInput } from '@actions/core'

export class GitHubInputProvider implements InputProvider {
  public fetchInput(): Input {
    return {
      server: this.getServerConfig(),
      target: this.getTargetConfig(),
      report: this.getReportConfig(),
      execution: this.getExecutionConfig(),
      email: this.getEmailConfig(),
      rbt: this.getRbtConfig()
    }
  }

  private getServerConfig(): ServerConfig {
    return {
      url: getInput('server-url', { required: true }),
      baseUrl: getInput('base-url')
    }
  }

  private getTargetConfig(): TargetConfig {
    return {
      type: getInput('target-type') || 'filePath',
      filePath: getInput('file-path'),
      folderPath: getInput('folder-path'),
      testCase: getInput('test-case')
    }
  }

  private getReportConfig(): ReportConfig {
    return {
      filePath: getInput('report-file-path', { required: true }),
      prefix: getInput('report-prefix'),
      frequency: this.parseIntOrDefault('report-frequency', 10),
      zipFormat: getBooleanInput('zip-report-format'),
      pdfFormat: getBooleanInput('pdf-report-format'),
      interval: this.parseIntRequired('report-interval'),
      passFailPercentage: this.parseIntOrDefault('pass-fail-per', 0)
    }
  }

  private getExecutionConfig(): ExecutionConfig {
    return {
      browser: getInput('browser') || 'Google Chrome',
      stepInterval: this.parseOptionalInt('step-execution-interval'),
      captureFailureScreenshot: getBooleanInput('capture-failure-screenshot'),
      captureConditionFailureScreenshot: getBooleanInput(
        'capture-condition-failure-screenshot'
      ),
      isAutoHealingEnabled: getBooleanInput('autohealing-enabled')
    }
  }

  private getEmailConfig(): EmailConfig {
    return {
      enabled: getBooleanInput('mail-report'),
      format: getInput('report-format') || 'Zip',
      to: getInput('to-address'),
      cc: getInput('cc-address'),
      bcc: getInput('bcc-address'),
      from: getInput('form-address'),
      subject: getInput('mail-subject'),
      body: getInput('mail-body'),
      attachment: getInput('attachment'),
      smtp: {
        server: getInput('smtp-server'),
        port: getInput('smtp-port'),
        username: getInput('smtp-username'),
        password: getInput('smtp-password')
      }
    }
  }

  private getRbtConfig(): RbtConfig {
    return {
      priorityHigh: getBooleanInput('rbt-priority-high'),
      priorityMedium: getBooleanInput('rbt-priority-medium'),
      priorityLow: getBooleanInput('rbt-priority-low'),
      labelExecutionEnabled: getBooleanInput('label-base-executions'),
      labels: getInput('txt-label-executions')
    }
  }

  private parseOptionalInt(name: string): number | undefined {
    const val = getInput(name)
    return val ? parseInt(val, 10) : undefined
  }

  private parseIntOrDefault(name: string, def: number): number {
    const val = getInput(name)
    return val ? parseInt(val, 10) : def
  }

  private parseIntRequired(name: string): number {
    const val = getInput(name, { required: true })
    const num = parseInt(val, 10)
    if (isNaN(num)) throw new Error(`${name} must be a valid number`)
    return num
  }
}
