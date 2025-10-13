/**
 * Centralized logging utility
 * Provides consistent logging with environment-aware behavior
 */

const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";

/**
 * Log levels
 */
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

  /**
   * Format log message with prefix
   */
  private format(level: LogLevel, message: string, ...args: any[]) {
    const timestamp = new Date().toISOString();
    const prefixStr = this.prefix ? `[${this.prefix}]` : "";

    return [`[${timestamp}] ${prefixStr} ${level}:`, message, ...args];
  }

  /**
   * Debug logs - development only
   */
  debug(message: string, ...args: any[]) {
    if (isDevelopment) {
      console.debug(...this.format(LogLevel.DEBUG, message, ...args));
    }
  }

  /**
   * Info logs - development only
   */
  info(message: string, ...args: any[]) {
    if (isDevelopment) {
      console.log(...this.format(LogLevel.INFO, message, ...args));
    }
  }

  /**
   * Warning logs - always shown
   */
  warn(message: string, ...args: any[]) {
    console.warn(...this.format(LogLevel.WARN, message, ...args));
  }

  /**
   * Error logs - always shown
   */
  error(message: string, ...args: any[]) {
    console.error(...this.format(LogLevel.ERROR, message, ...args));
  }
}

/**
 * Create a logger instance with optional prefix
 */
export function createLogger(prefix?: string): Logger {
  return new Logger(prefix);
}

/**
 * Default logger instance
 */
export const logger = new Logger();

/**
 * Specialized loggers for different modules
 */
export const loggers = {
  cache: createLogger("Redis"),
  api: createLogger("API"),
  data: createLogger("Data"),
  prefetch: createLogger("Prefetch"),
};
