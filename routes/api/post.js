var express = require('express');
var router = express.Router();

const { auth, admin } = require('../../middlewares/authentication');
const validateMiddleware = require('../../middlewares/validate');
const { validate, validateUpdate } = require('../../models/post');
const postController = require('../../controllers/postController');

/* GET posts listing. */
router.get('/', postController.postListSearch, postController.postList);

/* Search posts listing. */
router.post('/search', postController.postListSearch, postController.postList);

/* GET post by id or permark link. */
router.get('/:id', postController.postDetail);

/* UPDATE post by id or permark link. */
router.put('/:id', [auth, validateMiddleware(validateUpdate)], postController.postUpdate);

/* REGISTER post. */
router.post('/', [auth, admin, validateMiddleware(validate)], postController.postCreate);

module.exports = router;
