const logger = require('../startup/logging');
const messageGenerator = require('../common/messageGenerator');

module.exports = function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    let status = err.status || 500;
    res.status(status);
    logger.info(err);
    if (status >= 404 || err.type !== 'validate') {
        logger.error(err.stack);
    }

    // render error for API or normal
    if (req.originalUrl.startsWith('/api')) {
        let message = err.message || messageGenerator('system.sem0001') || 'Something failed.';
        if (status === 404) {
            message = messageGenerator('system.sem0001') || 'Not found.';
        }
        if (status === 500) {
            message = messageGenerator('system.sem0001') || 'Something failed.';
        }
        return res.json({
            success: false,
            message
        });
    } else {
        return res.render('error');
    }
}