
async function makeApiResponse(err, res, status, objResponse) {
    if (err) {
        const objError = {
            result: false,
            message: err.message
        }
        status = status || 400;
        return res.status(status).json(objError);
    }
    status = status || 200;

    const objSuccess = {
        result: true,
        data: objResponse
    }

    return await res.status(status).json(objSuccess);
}

exports.makeApiResponse = makeApiResponse;