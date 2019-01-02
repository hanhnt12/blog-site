const config = require('config');
const _ = require('lodash');

const asyncMiddleware = require('../middlewares/async');
const { Post } = require('../models/post');
const AppError = require('../common/error/AppError');
const logger = require('../startup/logging');
const { isValidObjectId } = require('../common/utils');

/** Get list post */
exports.postList = asyncMiddleware(async (req, res) => {
    logger.info(`Request post search condition:`);
    logger.info(req.prePostCondition);
    console.log(req.prePostCondition);
    if (!req.prePostCondition) {
        throw new AppError('system.sem0004', 500);
    }
    // Get from pre search request
    let { search, skip, limit, sort } = req.prePostCondition;

    // Count number of records to pagging
    let totalPromise = Post.find(search || {}).count();
    let postsPromise = Post.find(search || {})
        .populate('author', 'name')
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .select('-content');
    let [total, posts] = [await totalPromise, await postsPromise];
    //res.json(posts);
    res.responseData = {
        total,
        list: posts
    };
});

/** Middleware create search condition for post list */
/**
 * Sample request search object
 *  // {
    //     "keyword": "test keyword",
    //     "page": 1,   // START PAGE is 1
    //     "perPage": 20
    //     "orderBy": {
    //          "mostView": 1, // ASC
    //          "createDate": -1 // DESC
    //      }
    // }
 */
exports.postListSearch = asyncMiddleware(async (req, res) => {
    let { keyword, page, perPage, orderBy, isPublished } =
        _.pick(req.body, ['keyword', 'page', 'perPage', 'orderBy', 'isPublished']);
    // Create search post
    // Default is post that published
    logger.info(`Search condition isPublished: ${isPublished}`);
    let search = {
        isPublished: _.isUndefined(isPublished) ? true : isPublished
    };
    if (keyword) {
        search.title = keyword;
    }

    // pagging: default 20 record per page
    if (!page || isNaN(page) || page <= 0) {
        page = config.get('pagging.startPage') || 1;
    }
    if (!perPage || isNaN(perPage) || perPage <= 0) {
        perPage = config.get('pagging.recordPerPage') || 20;
    }
    // Starting row
    let skip = (page - 1) * perPage;
    // Number of row response
    let limit = perPage;

    // Create sort post
    let sort = {};
    if (!_.isEmpty(orderBy)) {
        // copy object
        Object.assign(sort, orderBy);
    }
    // Default is time create DESC
    if (!sort.hasOwnProperty('createDate')) {
        sort.createDate = -1;
    }

    req.prePostCondition = { search, skip, limit, sort };
    // asyncMiddleware will auto next
});

/** Create new post */
exports.postCreate = asyncMiddleware(async (req, res) => {
    // Register new post
    let post = new Post(_.pick(req.body, ['title', 'content']));
    post.author = req.user._id;
    logger.debug('Create new post:', post);
    await post.save();

    // Response
    // res.json(_.pick(post, ['_id', 'title', 'permarkLink', 'createDate', 'isPublished']));
    res.responseData = _.pick(post, ['_id', 'title', 'permarkLink', 'createDate', 'isPublished']);
});

/** Get post detail by id or permark link */
exports.postDetail = asyncMiddleware(async (req, res) => {
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
    // res.json(post);
    res.responseData = post;
});

/** Update post by id or permark link */
exports.postUpdate = asyncMiddleware(async (req, res) => {
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
    
    // Response
    // res.json(post);
    res.responseData = post;
});