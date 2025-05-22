import {
  ExecutionConfig,
  Progress,
  RbtConfig,
  ReportConfig,
  ServerConfig,
  TargetConfig
} from '@/types/index.js'
import { ServerManager, ReportManager } from '@/service/index.js'
import { delay } from '@/util/index.js'

export class ScriptExecutor {
  private token: string = ''
  private serverURL: string
  private baseURL: string | undefined
  private target: TargetConfig

  private static defaultHeaders = {
    'Content-Type': 'application/json'
  }

  constructor(server: ServerConfig, target: TargetConfig) {
    this.serverURL = server.url.replace(/\/?$/, '/')
    this.baseURL = server.baseUrl?.replace(/\/?$/, '/')
    this.target = target
  }

  public async execute(
    executionConfig: ExecutionConfig,
    reportConfig: ReportConfig,
    rbtConfig: RbtConfig,
    server: ServerManager
  ): Promise<string> {
    this.token = await this.getTokenForFile(server)
    await this.setParamsForFile(executionConfig, reportConfig, rbtConfig)
    await this.runScript()
    return this.token
  }

  private async getTokenForFile(server: ServerManager): Promise<string> {
    try {
      const urlLoad = `${this.serverURL}load`
      const response = await fetch(urlLoad, {
        method: 'POST',
        headers: ScriptExecutor.defaultHeaders,
        body: JSON.stringify({
          fileName: this.target.filePath,
          fileType: 'twizx'
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
          `Failed to load token: ${response.status} ${response.statusText} - ${errorText} for file: ${this.target.filePath}`
        )
      }

      return (await response.text()).trim()
    } catch (error) {
      const isRestarted = await server.restartTWServer()
      if (isRestarted) {
        await delay(3 * 60 * 1000)
        return this.getTokenForFile(server)
      }
      console.error('Error while getting the token : ', error)
      throw new Error(
        ` [${this.serverURL}] is Invalid URL or provided Script or File Path is wrong
     Please Provide URL of the TestingWhiz Automation server in the format http://host:port/ or Check the provided Script or File Path`
      )
    }
  }

  private async setParamsForFile(
    executionConfig: ExecutionConfig,
    reportConfig: ReportConfig,
    rbtConfig: RbtConfig
  ): Promise<boolean> {
    const urlParam: string = `${this.serverURL}params?token=${this.token}`
    const stepInterval: number =
      executionConfig.stepInterval !== undefined &&
      executionConfig.stepInterval >= 0
        ? executionConfig.stepInterval
        : 0
    const body: string = JSON.stringify({
      browser: executionConfig.browser,
      interval: stepInterval,
      operatingSystem: 'Windows',
      version: '',
      isRBTEnable: (rbtConfig.priorityHigh ||
        rbtConfig.priorityMedium ||
        rbtConfig.priorityLow) as boolean,
      highPriority: rbtConfig.priorityHigh,
      mediumPriority: rbtConfig.priorityMedium,
      lowPriority: rbtConfig.priorityLow,
      isLabelBaseTestExecution: rbtConfig.labelExecutionEnabled,
      settingLabel: rbtConfig.labels,
      testObject: this.target.testCase,
      isAutoHealingEnabled: executionConfig.isAutoHealingEnabled,
      reportPath: reportConfig.filePath,
      baseURL: this.baseURL,
      isFailureScreenshot: executionConfig.captureConditionFailureScreenshot,
      isConditionFailureScreenshot: executionConfig.captureFailureScreenshot
    })

    const response = await fetch(urlParam, {
      method: 'POST',
      headers: ScriptExecutor.defaultHeaders,
      body: body
    })

    return response.ok
  }

  private async runScript(): Promise<boolean> {
    const url = `${this.serverURL}play?token=${this.token}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok)
      throw new Error(`Server responded with status ${response.status}`)
    return response.ok
  }

  public async startMonitoringAndReporting(
    reportConfig: ReportConfig,
    reportManager: ReportManager
  ): Promise<void> {
    console.log(` Executing Script File : ${this.target.filePath}`)
    console.log(
      '\n ========================== Script Execution Start ==========================='
    )
    console.log('\n Script  0 %  completed')
    await this.monitorAndReportProgress(reportConfig, reportManager)
    console.log(' Script  100 %  completed')
    console.log(
      '\n ========================== Script Execution End ===========================\n'
    )
    await delay(reportConfig.interval)
    reportManager.generateReport(this.token)
  }

  private async monitorAndReportProgress(
    reportConfig: ReportConfig,
    reportManager: ReportManager
  ): Promise<void> {
    const CHECK_INTERVAL_MS = 5 * 1000
    const RETRY_INTERVAL_MS = 2 * 1000
    const MAX_RETRIES = 5

    let lastReportedProgress = 0
    let nextThreshold = reportConfig.frequency
    let retryCount = 0

    while (true) {
      const progress = await this.progress()

      if (!progress) {
        if (++retryCount >= MAX_RETRIES) break
        await delay(RETRY_INTERVAL_MS)
        continue
      }

      retryCount = 0 // Reset retry counter on valid progress

      const { status, progress: currentProgress } = progress

      if (status === 'stop') break

      if (status === 'play' || status === 'pause') {
        // Only process if progress increased
        if (currentProgress > lastReportedProgress) {
          console.log(` Script ${currentProgress}% completed`)

          // Generate report if threshold reached and not complete
          if (currentProgress !== 100 && currentProgress >= nextThreshold) {
            console.log(` Triggered report for ${currentProgress}% completion`)
            await reportManager.generateReport(this.token)
            nextThreshold += reportConfig.frequency
          }

          lastReportedProgress = currentProgress
        }

        // Wait for next check interval
        await delay(CHECK_INTERVAL_MS)
      }
    }
  }

  // private async stopScript(): Promise<boolean> {
  //   const url = `${this.serverURL}cancel_execution?token=${this.token}`
  //   const response = await fetch(url, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   })

  //   if (!response.ok)
  //     throw new Error(`Server responded with status ${response.status}`)
  //   return response.ok
  // }

  private async progress(): Promise<Progress | false> {
    const progressUrl = `${this.serverURL}progress?token=${this.token}`

    try {
      const response = await fetch(progressUrl, {
        method: 'GET',
        headers: ScriptExecutor.defaultHeaders
      })

      if (!response.ok) return false
      return (await response.json()) as Progress
    } catch {
      return false
    }
  }

  public get Token(): string {
    return this.token
  }
}
