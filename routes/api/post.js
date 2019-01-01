const logger = require('../../startup/logging');
const config = require('config');
const { isValidObjectId } = require('../../common/utils');
const _ = require('lodash');
const asyncMiddleware = require('../../middlewares/async');
const { auth, admin } = require('../../middlewares/authentication');
const validateMiddleware = require('../../middlewares/validate');
const { Post, validate } = require('../../models/post');
const AppError = require('../../common/error/AppError');
var express = require('express');
var router = express.Router();

/* GET posts listing. */
router.get('/', asyncMiddleware(async (req, res) => {
    let search = {};
    let posts = await Post.find(search)
        .populate('author', 'name')
        .sort({ createDate: -1 })
        // .skip(10)
        // .limit(config.get('posts.recordPerPage') || config.get('pagging.recordPerPage'))
        .select('-content');
    res.json(posts);
}));

/* GET post by id. */
router.get('/:id', auth, asyncMiddleware(async (req, res) => {
    let id = req.params.id;
    let post;
    // Get post details
    if (isValidObjectId(id)) {
        post = await Post.findById(id).populate('author', 'name');
    } else {
        post = await Post.findOne({ permarkLink: id }).populate('author', 'name');
    }
    // Check existing post
    if (!post) {
        throw new AppError('post.uvm0004', 404);
    }

    // Increment post view
    post.incrementView();
    post.save();
    // Response
    res.json(post);
}));

/* UPDATE post by id. */
router.put('/:id', [auth, validateMiddleware(validate)], asyncMiddleware(async (req, res) => {
    let id = req.params.id;
    let post;
    // Create post to update
    let newPost = _.pick(req.body, ['title', 'content', 'isPublished']);
    newPost.updateBy = req.user._id;
    logger.debug('Update post:');
    logger.debug(newPost);
    let updatingPost = {
        $set: newPost,
        $currentDate: {
            updateDate: true,
        }
    }
    // Update post
    if (isValidObjectId(id)) {
        post = await Post.findByIdAndUpdate(id, updatingPost, { new: true });
    } else {
        post = await Post.findOneAndUpdate({ permarkLink: id }, updatingPost, { new: true });
    }
    res.json(post);
}));

/* REGISTER post. */
router.post('/', [auth, admin, validateMiddleware(validate)], asyncMiddleware(async (req, res) => {
    // Register new post
    let post = new Post(_.pick(req.body, ['title', 'content']));
    post.author = req.user._id;
    logger.debug('Create new post:', post);
    await post.save();

    // Response
    res.json(_.pick(post, ['_id', 'title', 'permarkLink', 'createDate', 'isPublished']));
}));

module.exports = router;
