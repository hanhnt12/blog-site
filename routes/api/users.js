const config = require('config');
const _ = require('lodash');
const asyncMiddleware = require('../../middlewares/async');
const { auth, admin } = require('../../middlewares/authentication');
const { User, validate } = require('../../models/user');
const AppError = require('../../common/error/AppError');
var express = require('express');
var router = express.Router();

/* TEMPLATE Request */
// router.get('/template', asyncMiddleware(async (req, res) => {
//     res.send('respond with a resource');
// }));

/* GET users listing. */
router.get('/', [auth, admin], asyncMiddleware(async (req, res) => {
    let users = await User.find().select('-password');
    res.json(users);
}));

/* GET current user. */
router.get('/me', auth, asyncMiddleware(async (req, res) => {
    let user = await User.findById(req.user._id).select('-password');
    res.json(user);
}));

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
