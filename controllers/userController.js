const config = require('config');
const _ = require('lodash');
const asyncMiddleware = require('../middlewares/async');
const { User } = require('../models/user');
const AppError = require('../common/error/AppError');

/* GET users listing. */
exports.userList = asyncMiddleware(async (req, res) => {
    let users = await User.find().select('-password');
    res.json(users);
});

/* GET current user. */
exports.userCurrent = asyncMiddleware(async (req, res) => {
    let user = await User.findById(req.user._id).select('-password');
    res.json(user);
});

/* REGISTER user. */
exports.userCreate = asyncMiddleware(async (req, res) => {
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
});

