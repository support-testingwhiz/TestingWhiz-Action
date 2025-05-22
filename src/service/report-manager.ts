import { ReportConfig, ServerConfig } from '@/types/index.js'
import { FileManager } from '@/service/file-manager.js'
import path from 'path'
import { delay, generateTimestamp } from '@/util/index.js'

export class ReportManager {
  private serverURL: string
  private reportConfig: ReportConfig
  private static reportTemplate: string = './ReportTemplate'
  private fileManager: FileManager
  private static defaultHeaders = {
    'Content-Type': 'application/json'
  }

  constructor(
    server: ServerConfig,
    reportConfig: ReportConfig,
    fileManager: FileManager
  ) {
    this.serverURL = server.url.replace(/\/?$/, '/')
    this.reportConfig = reportConfig
    this.fileManager = fileManager
  }

  public init = async (folderTimeStamp?: string): Promise<void> => {
    const timeStamp: string = generateTimestamp()
    const reportFolderExtraPath = folderTimeStamp
      ? path.join(
          this.reportConfig.prefix ? this.reportConfig.prefix : '',
          `Report_${folderTimeStamp}`
        )
      : ''
    this.reportConfig.filePath = path.join(
      this.reportConfig.filePath,
      reportFolderExtraPath,
      this.reportConfig.prefix ? this.reportConfig.prefix : '',
      `Report_${timeStamp}`
    )

    if (!this.fileManager.pathExists(ReportManager.reportTemplate)) {
      await this.fileManager.copyFolderRecursive(
        ReportManager.reportTemplate,
        this.reportConfig.filePath
      )
      await delay(2000)
    } else if (!this.fileManager.pathExists(this.reportConfig.filePath)) {
      await this.fileManager.copyFolderRecursive(
        ReportManager.reportTemplate,
        this.reportConfig.filePath
      )
      await delay(2000)
    } else {
      throw new Error(' Task Failed : Report Template not Found !!')
    }
  }

  public generateReport = async (token: string): Promise<void> => {
    const reportContent = await this.reportInterim(token)
    if (!reportContent) return
    const reportFilePath = path.join(
      this.reportConfig.filePath,
      'data',
      'results.js'
    )
    try {
      await this.fileManager.writeVariableToFile(
        reportFilePath,
        'results',
        reportContent
      )
    } catch (error) {
      console.error('Error writing report file:', error)
    }
  }

  private reportInterim = async (token: string): Promise<string | false> => {
    const reportUrl = `${this.serverURL}report_interim?token=${token}`
    const response = await fetch(reportUrl, {
      method: 'GET',
      headers: ReportManager.defaultHeaders
    })
    if (!response.ok) return false
    return (await response.text()) as string
  }
}
