const config = require('config');
const _ = require('lodash');
const asyncMiddleware = require('../../middlewares/async');
const { User, validate } = require('../../models/user');
const AppError = require('../../common/error/AppError');
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

/* REGISTER user. */
router.post('/', asyncMiddleware(async (req, res) => {
    // Validate request
    const { error } = validate(req.body);
    if (error) {
        throw new AppError(error.message || error.details[0].message, 400);
    }

    // Check existing user
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        throw new AppError('user.uvm0004', 400);
    }

    // Register user
    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    await user.hashPassword();
    await user.save();

    // Create authentication token
    token = user.generateToken();

    // Response
    res.header(config.get('authConfig.tokenHeader'), token);
    res.json(_.pick(user, ['_id', 'name', 'email']));
})
);

module.exports = router;
