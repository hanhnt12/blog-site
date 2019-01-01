const AppError = require('../common/error/AppError');

module.exports = function (validate) {
    return async (req, res, next) => {
        try {
            // Validate request
            const { error } = validate(req.body);
            if (error) {
                throw new AppError(error.message || error.details[0].message, 400);
            }
            next();
        } catch (err) {
            next(err);
        }
    }
}