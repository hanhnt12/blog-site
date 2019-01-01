const jwt = require('jsonwebtoken');
const config = require('config');
const AppError = require('../common/error/AppError');

function auth(req, res, next) {
    const token = req.header(config.get('authConfig.tokenHeader')) || req.body.token;
    if (!token) {
        throw new AppError('auth.avm0002', 401);
    }

    try {
        const decoded = jwt.verify(token, config.get('authConfig.jwtPrivateKey'));
        req.user = decoded;
        next();
    } catch (ex) {
        throw new AppError('auth.avm0003', 400);
    }
}

function isAdmin(req, res, next) {
    if (!req.user.isAdmin) {
        throw new AppError('auth.avm0002', 403);
    }
    next();
}

exports.auth = auth;
exports.admin = isAdmin;