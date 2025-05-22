export interface Progress {
  status: 'none' | 'load' | 'play' | 'pause' | 'next' | 'stop'
  time: number
  progress: number
}
