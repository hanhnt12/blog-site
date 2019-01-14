var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('post/list', { title: 'Express' });
});

/* GET post detail page. */
router.get('/:id', function(req, res, next) {
    res.render('post/detail', { title: 'Express', postId: req.params.id });
});

module.exports = router;
