var express = require('express');
var router = express.Router();

const { auth, admin } = require('../../middlewares/authentication');
const validateMiddleware = require('../../middlewares/validate');
const { validate } = require('../../models/post');
const postController = require('../../controllers/postController');

/* GET posts listing. */
router.get('/', postController.postList);

/* GET post by id or permark link. */
router.get('/:id', auth, postController.postDetail);

/* UPDATE post by id or permark link. */
router.put('/:id', [auth, validateMiddleware(validate)], postController.postUpdate);

/* REGISTER post. */
router.post('/', [auth, admin, validateMiddleware(validate)], postController.postCreate);

module.exports = router;
