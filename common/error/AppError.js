const messageGenerator = require('../messageGenerator');

class ExtendableError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }
}

class AppError extends ExtendableError {
    constructor(message, status = 500, type = 'validate') {
        message = messageGenerator(message) || message
        super(message);
        this._status = status;
        this._type = type;
    }

    get status() {
        return this._status
    }

    get type() {
        return this._type;
    }
}

module.exports = AppError;