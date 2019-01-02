var express = require('express');
var router = express.Router();

const _ = require('lodash');

const { auth, admin } = require('../../middlewares/authentication');
const validateMiddleware = require('../../middlewares/validate');
const { validate } = require('../../models/user');
const userController = require('../../controllers/userController');

/* GET users listing. */
router.get('/', [auth, admin], userController.userList);

/* GET current user. */
router.get('/me', auth, userController.userCurrent);

/* REGISTER user. */
router.post('/', validateMiddleware(validate), userController.userCreate);

module.exports = router;
