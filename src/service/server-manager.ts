import { ServerConfig } from '@/types/index.js'

export class ServerManager {
  private serverURL: string
  private static defaultHeaders = {
    'Content-Type': 'application/json'
  }

  constructor(serverUrl: ServerConfig) {
    this.serverURL = serverUrl.url.replace(/\/?$/, '/')
  }

  public async checkServer(): Promise<boolean> {
    const response = await fetch(this.serverURL, {
      method: 'GET',
      headers: ServerManager.defaultHeaders
    })
    return response.ok
  }

  public async restartTWServer(): Promise<boolean> {
    const urlRestartTw = `${this.serverURL}restart-tw`
    const response = await fetch(urlRestartTw, {
      method: 'GET',
      headers: ServerManager.defaultHeaders
    })
    return response.ok
  }

  public async disposeMemory(token: string): Promise<boolean> {
    const url = `${this.serverURL}despose?token=${token}`
    const response = await fetch(url, {
      method: 'GET',
      headers: ServerManager.defaultHeaders
    })
    return response.ok
  }
}
