// Sistema di logging centralizzato per l'applicazione
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;
  private isDevelopment: boolean;

  private constructor() {
    this.isDevelopment = import.meta.env.DEV;
    this.logLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.ERROR;
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  public debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }

  public info(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  public warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  public error(message: string, error?: Error | unknown, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      if (error instanceof Error) {
        console.error(`[ERROR] ${message}`, error.message, error.stack, ...args);
      } else {
        console.error(`[ERROR] ${message}`, error, ...args);
      }
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }
}

// Esporta un'istanza singleton del logger
export const logger = Logger.getInstance();

// Funzioni di convenienza per un uso più semplice
export const logDebug = (message: string, ...args: unknown[]) => logger.debug(message, ...args);
export const logInfo = (message: string, ...args: unknown[]) => logger.info(message, ...args);
export const logWarn = (message: string, ...args: unknown[]) => logger.warn(message, ...args);
export const logError = (message: string, error?: Error | unknown, ...args: unknown[]) => logger.error(message, error, ...args);