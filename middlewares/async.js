const logger = require('../startup/logging');

module.exports = function (handler) {
    return async (req, res, next) => {
        try {
            let startTime = new Date().getMilliseconds();
            await handler(req, res);
            let endTime = new Date().getMilliseconds();
            logger.info(`[${req.method} ${req.originalUrl} ${res.statusCode}]: Main process response time: ${endTime - startTime}ms`);
            next();
        } catch (err) {
            next(err);
        }
    }
}