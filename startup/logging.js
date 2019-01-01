var moment = require('moment');
var appRoot = require('app-root-path');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf, prettyPrint } = format;

// define the custom settings for each transport (file, console)
var options = {
    fileError: {
        level: 'error',
        filename: `${appRoot}/logs/error.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
        timestamp: () => moment().format('YYYY-MM-DD HH-mm-ss'),
        formatter: options => `[${options.timestamp()}]: ${options.message || ''}`
    },
    fileInfo: {
        level: 'info',
        filename: `${appRoot}/logs/combined.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
        timestamp: () => moment().format('YYYY-MM-DD HH-mm-ss'),
        formatter: options => `[${options.timestamp()}]: ${options.message || ''}`
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
        timestamp: () => moment().format('YYYY-MM-DD HH-mm-ss'),
        formatter: options => `${options.message || ''}`
    },
};

const customFormat = printf(info => {
  return `[${info.timestamp}] ${info.level}: ${info.message}`;
});

// instantiate a new Winston Logger with the settings defined above
var logger = createLogger({
    format: combine(
        timestamp('YYYY-MM-DD HH-mm-ss'),
        customFormat
    ),
    transports: [
        new transports.File({
            level: 'error',
            filename: `${appRoot}/logs/error.log`,
            json: true,
            maxsize: 5242880, // 5MB
            maxFiles: 5
        }),
        new transports.File(options.fileInfo)
    ],
    exitOnError: false, // do not exit on handled exceptions
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console(options.console));
}

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
    write: function(message, encoding) {
        // use the 'info' log level so the output will be picked up by both transports (file and console)
        logger.info(message);
    },
};

module.exports = logger;