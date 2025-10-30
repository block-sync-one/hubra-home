/**
 * Centralized logging utility
 * Provides consistent logging with environment-aware behavior
 */

const isDevelopment = process.env.NODE_ENV === "development";

enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

/**
 * Centralized logger with environment awareness
 * - Development: All logs shown
 * - Production: Only errors and warnings
 */
class Logger {
  private prefix: string;

  constructor(prefix: string = "") {
    this.prefix = prefix;
  }

  private format(level: LogLevel, message: string, ...args: any[]) {
    const timestamp = new Date().toISOString();
    const prefixStr = this.prefix ? `[${this.prefix}]` : "";

    return [`[${timestamp}] ${prefixStr} ${level}:`, message, ...args];
  }

  debug(message: string, ...args: any[]) {
    if (isDevelopment) {
      console.debug(...this.format(LogLevel.DEBUG, message, ...args));
    }
  }

  info(message: string, ...args: any[]) {
    if (isDevelopment) {
      console.log(...this.format(LogLevel.INFO, message, ...args));
    }
  }

  warn(message: string, ...args: any[]) {
    console.warn(...this.format(LogLevel.WARN, message, ...args));
  }

  error(message: string, ...args: any[]) {
    console.error(...this.format(LogLevel.ERROR, message, ...args));
  }
}

export function createLogger(prefix?: string): Logger {
  return new Logger(prefix);
}

export const logger = new Logger();

export const loggers = {
  cache: createLogger("Redis"),
  api: createLogger("API"),
  data: createLogger("Data"),
  prefetch: createLogger("Prefetch"),
};
