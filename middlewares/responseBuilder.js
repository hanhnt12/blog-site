const AppError = require('../common/error/AppError');
const logger = require('../startup/logging');
const messageGenerator = require('../common/messageGenerator');

module.exports = async function (req, res, next) {
    logger.info(`Access response builder...`);
    // only build response for API
    if (req.originalUrl.startsWith('/api')) {
        if (res.hasOwnProperty('responseData')) {
            return res.json({
                success: true,
                responseData: res.responseData
            });
        } else {
            logger.error(`Response data wasn't set`);
            next(new AppError(`Response data wasn't set`));
            // let message = messageGenerator('system.sem0003') || 'Not found any response.';
            // res.status(404);
            // return res.json({
            //     success: false,
            //     message
            // });
        }
    }
    next();
}