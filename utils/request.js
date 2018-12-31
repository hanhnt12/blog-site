const _ = require('lodash');
const { makeApiResponse } = require('./response');

async function makeValidate(req, res, validate) {

    if (!_.isFunction(validate)) {
        return;
    }

    const { error } = validate(req.body);

    if (error) {
        const objError = {
            message: error.message
        }
        return await makeApiResponse(objError, res, 400);
    }
}

exports.makeValidate = makeValidate;