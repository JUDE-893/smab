import winston from 'winston';
import DailyRotateFile from "winston-daily-rotate-file";

// define log message format 
const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `[${level.toUpperCase()}] ${timestamp} - ${message}`;
});

// define dailly file creation and format
const dailyRotateFileTransport = (dir) => 
    new DailyRotateFile({
        filename: 'app-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '365d', 
        dirname: `logs/${dir}`
    });

const infoLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    customFormat
  ),
  transports: [
    dailyRotateFileTransport("info"),
    // Console output
    new winston.transports.Console()
  ]
});

const errLogger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    customFormat
  ),
  transports: [
    dailyRotateFileTransport("error"),
    // Console output
    new winston.transports.Console()
  ]
});

export default {
  info: (msg) => infoLogger.info(msg),
  warn: (msg) => infoLogger.info(msg),
  error: (msg) => errLogger.error(msg)
}



