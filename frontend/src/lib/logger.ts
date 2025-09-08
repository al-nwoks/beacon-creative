/**
 * frontend/src/lib/logger.ts
 *
 * Centralized logging utility for the frontend application.
 * Provides structured logging with different log levels and context.
 */

// Define log levels
type LogLevel = 'error' | 'warn' | 'info' | 'debug';

// Logger configuration
const LOG_LEVEL: LogLevel = (process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel) || 'info';

// Check if we're in development environment
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

// Log level priorities
const LOG_LEVELS: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

// Check if a log level should be logged based on current configuration
const shouldLog = (level: LogLevel): boolean => {
  return LOG_LEVELS[level] <= LOG_LEVELS[LOG_LEVEL];
};

// Format log message with timestamp and context
const formatLogMessage = (level: LogLevel, message: string, context?: Record<string, any>): string => {
  const timestamp = new Date().toISOString();
  const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  
  if (context) {
    return `${formattedMessage} | Context: ${JSON.stringify(context)}`;
  }
  
  return formattedMessage;
};

// Main logger function
const log = (level: LogLevel, message: string, context?: Record<string, any>): void => {
  if (!shouldLog(level)) {
    return;
  }

  const formattedMessage = formatLogMessage(level, message, context);

  switch (level) {
    case 'error':
      console.error(formattedMessage);
      break;
    case 'warn':
      console.warn(formattedMessage);
      break;
    case 'info':
      console.info(formattedMessage);
      break;
    case 'debug':
      console.debug(formattedMessage);
      break;
    default:
      console.log(formattedMessage);
  }
};

// Specific log level functions
export const logger = {
  error: (message: string, context?: Record<string, any>): void => {
    log('error', message, context);
  },
  
  warn: (message: string, context?: Record<string, any>): void => {
    log('warn', message, context);
  },
  
  info: (message: string, context?: Record<string, any>): void => {
    log('info', message, context);
  },
  
  debug: (message: string, context?: Record<string, any>): void => {
    log('debug', message, context);
  },
  
  // Log API requests
  apiRequest: (method: string, url: string, data?: any): void => {
    logger.debug(`API Request: ${method} ${url}`, {
      ...(data && { requestData: data })
    });
  },
  
  // Log API responses
  apiResponse: (method: string, url: string, status: number, data?: any): void => {
    logger.debug(`API Response: ${method} ${url} ${status}`, {
      ...(data && { responseData: data })
    });
  },
  
  // Log API errors
  apiError: (method: string, url: string, error: any): void => {
    // Extract detailed error information
    let errorDetails: any = {};
    
    if (error && typeof error === 'object') {
      if (error.message) {
        errorDetails.message = error.message;
      }
      if (error.response) {
        errorDetails.response = error.response;
      }
      if (error.status) {
        errorDetails.status = error.status;
      }
      if (error.data) {
        errorDetails.data = error.data;
      }
      // If it's a generic object, stringify it to see its contents
      if (Object.keys(errorDetails).length === 0) {
        errorDetails = JSON.stringify(error, null, 2);
      }
    } else {
      errorDetails = error;
    }
    
    logger.error(`API Error: ${method} ${url}`, {
      error: errorDetails
    });
  }
};

export default logger;