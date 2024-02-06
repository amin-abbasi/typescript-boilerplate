import gach, { Colors } from 'gach'

export enum LOG_LEVEL {
  DEBUG = 'debug',
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info'
}

const LOG_PRIORITY: Record<LOG_LEVEL, number> = {
  [LOG_LEVEL.INFO]: 1,
  [LOG_LEVEL.DEBUG]: 2,
  [LOG_LEVEL.WARN]: 3,
  [LOG_LEVEL.ERROR]: 4
}

const LOG_COLORS: Record<LOG_LEVEL, Colors> = {
  [LOG_LEVEL.DEBUG]: 'blue',
  [LOG_LEVEL.ERROR]: 'red',
  [LOG_LEVEL.WARN]: 'yellow',
  [LOG_LEVEL.INFO]: 'cyan'
}

export class Logger {
  private logPriority: number

  constructor(level: LOG_LEVEL = LOG_LEVEL.INFO) {
    this.logPriority = LOG_PRIORITY[level]
  }

  private log(level: LOG_LEVEL, ...args: any[]): void {
    if (LOG_PRIORITY[level] >= this.logPriority) {
      const coloredLevel = gach(`[${level.toUpperCase()}]`).color(LOG_COLORS[level]).text
      const coloredTime = gach(`[${Logger.getTimestamp()}]`).color('blue').text
      const logMessage = `${coloredTime} ${coloredLevel} ${args.join(' ')}`
      console[level](logMessage)
    }
  }

  static getTimestamp() {
    return new Date().toISOString().replace('T', ' - ').replace('Z', '')
  }

  setLevel(level: LOG_LEVEL) {
    this.logPriority = LOG_PRIORITY[level]
  }

  error(...args: any[]): void {
    this.log(LOG_LEVEL.ERROR, args)
  }

  warn(...args: any[]): void {
    this.log(LOG_LEVEL.WARN, args)
  }

  info(...args: any[]): void {
    this.log(LOG_LEVEL.INFO, args)
  }

  debug(...args: any[]): void {
    this.log(LOG_LEVEL.DEBUG, args)
  }
}

export const logger = new Logger()
