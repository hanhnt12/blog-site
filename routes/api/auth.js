var express = require('express');
var router = express.Router();

const Joi = require('joi');
const config = require('config');

const asyncMiddleware = require('../../middlewares/async');
const validateMiddleware = require('../../middlewares/validate');
const { User } = require('../../models/user');
const AppError = require('../../common/error/AppError');

/* AUTHENTICATION user. */
router.post('/', validateMiddleware(validate), asyncMiddleware(async (req, res) => {
    // Check existing user
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        throw new AppError('auth.avm0001', 400);
    }

    // Validate password
    if (!await user.isValidPassword(req.body.password)) {
        throw new AppError('auth.avm0001', 400);
    }

    // Create authentication token
    token = user.generateToken();

    // Response
    res.header(config.get('authConfig.tokenHeader'), token);
    res.json({
        token
    });
}));

function validate(req) {
    const schema = {
        email: Joi.string().required().email().error(new Error('user.uvm0002')),
        password: Joi.string().max(255).required().error(new Error('user.uvm0003'))
    }
    return Joi.validate(req, schema);
}

module.exports = router;
