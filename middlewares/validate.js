const _ = require('lodash');

function makeValidate(req, res, validate) {

    if (!_.isFunction(validate)) {
        return;
    }

    const { error } = validate(req.body);

    if (error) {
        const objError = {
            message: message
        }
    }
    return makeApiResponse(objError, res, 400);
}

exports.makeValidate = makeValidate;