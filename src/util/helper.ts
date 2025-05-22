export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

const formatPart = (n: number): string => n.toString().padStart(2, '0')

export const generateTimestamp = (): string => {
  const now = new Date()
  const dd = formatPart(now.getDate())
  const mm = formatPart(now.getMonth() + 1)
  const yyyy = now.getFullYear()
  const hh = formatPart(now.getHours() % 12 || 12)
  const min = formatPart(now.getMinutes())
  const ss = formatPart(now.getSeconds())
  return `${dd}${mm}${yyyy}_${hh}${min}${ss}`
}
