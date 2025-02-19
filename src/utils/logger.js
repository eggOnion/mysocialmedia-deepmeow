const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Define logs directory
const logsDir = path.join(__dirname, '../', '../', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Custom filter function for log levels
const filterOnly = (level) =>
  winston.format((info) => (info.level === level ? info : false))();

// Create logger with strict filtering
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    // Console output (logs everything)
    new winston.transports.Console({ format: winston.format.simple() }),

    // Log only errors
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      format: filterOnly('error'),
    }),

    // Log only warnings
    new winston.transports.File({
      filename: path.join(logsDir, 'warn.log'),
      level: 'warn',
      format: filterOnly('warn'),
    }),

    // Log only info
    new winston.transports.File({
      filename: path.join(logsDir, 'info.log'),
      level: 'info',
      format: filterOnly('info'),
    }),

    // Combined log (all levels)
    new winston.transports.File({ filename: path.join(logsDir, 'combined.log') }),
  ],
});

// Helper method to log custom file types dynamically
logger.logToFile = (level, message, fileName) => {
  const customLogFilePath = path.join(logsDir, `${fileName}.log`);
  const customTransport = new winston.transports.File({ filename: customLogFilePath, level });

  // Temporarily add the custom transport
  logger.add(customTransport);
  logger.log({ level, message });

  // Remove it after logging (to prevent stacking)
  logger.remove(customTransport);
};

module.exports = logger;


// ----------------------------------------- First Version -----------------------------------------

// const winston = require('winston');
// const path = require('path');
// const fs = require('fs');

// // Define logs directory
// const logsDir = path.join(__dirname, '../', '../', 'logs');
// if (!fs.existsSync(logsDir)) {
//   fs.mkdirSync(logsDir);
// }

// // Create logger with dynamic file types
// const logger = winston.createLogger({
//   level: 'info', // Default log level
//   format: winston.format.combine(
//     winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
//     winston.format.printf(({ timestamp, level, message }) => {
//       return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
//     })
//   ),
//   transports: [
//     // Console output
//     new winston.transports.Console({ format: winston.format.simple() }),

//     // Log levels
//     new winston.transports.File({ filename: path.join(logsDir, 'error.log'), level: 'error' }),
//     new winston.transports.File({ filename: path.join(logsDir, 'warn.log'), level: 'warn' }),
//     new winston.transports.File({ filename: path.join(logsDir, 'info.log'), level: 'info' }),
//     new winston.transports.File({ filename: path.join(logsDir, 'combined.log') }) // All logs
//   ]
// });

// // Helper method to log custom file types
// logger.logToFile = (level, message, fileName) => {
//   const customLogFilePath = path.join(logsDir, `${fileName}.log`);
//   const customTransport = new winston.transports.File({ filename: customLogFilePath, level });
  
//   // Temporarily add the custom transport
//   logger.add(customTransport);
//   logger.log({ level, message });

//   // Remove it after logging (to prevent stacking)
//   logger.remove(customTransport);
// };

// module.exports = logger;
