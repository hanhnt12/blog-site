var express = require('express');
var router = express.Router();

const { auth, admin } = require('../../middlewares/authentication');
const validateMiddleware = require('../../middlewares/validate');
const uploadController = require('../../controllers/uploadController');

/* Upload post image.*/
router.post('/post-image', [uploadController.validate], uploadController.upload);

module.exports = router;
