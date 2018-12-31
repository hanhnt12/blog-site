const Joi = require('joi');
const config = require('config');
const asyncMiddleware = require('../../middlewares/async');
const { User } = require('../../models/user');
const AppError = require('../../common/error/AppError');
var express = require('express');
var router = express.Router();

/* AUTHENTICATION user. */
router.post('/', asyncMiddleware(async (req, res) => {
    // Validate request
    const { error } = validate(req.body);
    if (error) {
        throw new AppError(error.message || error.details[0].message, 400);
    }

    // Check existing user
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        throw new AppError('user.avm0001', 400);
    }

    // Validate password
    if (!await user.isValidPassword(req.body.password)) {
        throw new AppError('user.avm0001', 400);
    }

    // Create authentication token
    token = user.generateToken();

    // Response
    res.header(config.get('authConfig.tokenHeader'), token);
    res.json({
        success: true
    });
})
);

function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    }
    return Joi.validate(req, schema);
}

module.exports = router;
