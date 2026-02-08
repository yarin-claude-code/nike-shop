const isDev = process.env.NODE_ENV === 'development'

export const logger = {
  info: (msg: string, data?: unknown): void => console.log(`[INFO] ${msg}`, data || ''),
  warn: (msg: string, data?: unknown): void => console.warn(`[WARN] ${msg}`, data || ''),
  error: (msg: string, err?: unknown): void => console.error(`[ERROR] ${msg}`, err || ''),
  debug: (msg: string, data?: unknown): void => {
    if (isDev) console.debug(`[DEBUG] ${msg}`, data || '')
  }
}
