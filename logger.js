const winston = require('winston');

const config = require('config').get('logger');

const logger = winston.createLogger({
    level: config.level,
    format: winston.format.simple(),
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        new winston.transports.File({filename: 'error.log', level: 'error'}),
        new winston.transports.File({filename: 'combined.log'})
    ],
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    },
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

module.exports = logger;