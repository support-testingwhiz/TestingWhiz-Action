import { debug, setFailed } from '@actions/core'
import { Input } from '@/types/index.js'
import { GitHubInputProvider } from '@/application/index.js'
import {
  FileManager,
  ReportManager,
  ScriptExecutor,
  ServerManager
} from '@/service/index.js'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const input: Input = new GitHubInputProvider().fetchInput()
    debug('Input fetched successfully')
    const fileManager: FileManager = new FileManager()
    debug('FileManager instance created successfully')
    const reportManager: ReportManager = new ReportManager(
      input.server,
      input.report,
      fileManager
    )
    debug('ReportManager instance created successfully')
    reportManager.init()
    debug('ReportTemplate initialized successfully')
    const { url } = input.server
    debug(`Server URL: ${url}`)
    const twServer = new ServerManager(input.server)
    debug('twServer instance created successfully')
    const isServerUp = await twServer.checkServer()
    debug(`Server status: ${isServerUp ? 'up' : 'down'}`)
    if (!isServerUp) {
      setFailed('Server is down')
      return
    }
    debug('Server is up')
    const scriptExecutor: ScriptExecutor = new ScriptExecutor(
      input.server,
      input.target
    )
    debug('ScriptExecutor instance created successfully')
    const token = await scriptExecutor.execute(
      input.execution,
      input.report,
      input.rbt,
      twServer
    )
    debug(`Token received: ${token}`)
    debug('Script execution completed')
    await scriptExecutor.startMonitoringAndReporting(
      input.report,
      reportManager
    )
    const isMemoryDisposed = await twServer.disposeMemory(token)
    debug(`Memory disposed for token ${token}: ${isMemoryDisposed}`)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) setFailed(error.message)
  }
}
