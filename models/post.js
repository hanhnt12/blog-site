const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');

const { generatePermarkLink } = require('../common/utils');

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    imgPath: {
        type: String
    },
    tags: [String],
    permarkLink: {
        type: String,
        default: function () {
            return generatePermarkLink(this.title);
        }
    },
    content: {
        type: String,
        required: true,
        minlength: 5
    },
    createDate: {
        type: Date,
        default: Date.now()
    },
    updateDate: {
        type: Date
    },
    updateBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    publishDate: {
        type: Date
    },
    view: {
        type: Number,
        default: 1
    }
});

postSchema.set('toJSON', {
    getters: true,
    virtuals: true
});

postSchema.methods.incrementView = function () {
    this.view++;
}

postSchema
    .virtual('detailUrl')
    .get(function() {
        return config.get('posts.prefixUrlDetail') + '/' + this.permarkLink;
    });

postSchema
    .virtual('detailUrlApi')
    .get(function () {
        // return url.resolve(config.get('posts.prefixUrlDetailApi'), '/', this.permarkLink);
        return config.get('posts.prefixUrlDetailApi') + '/' + this.permarkLink;
    });

const Post = mongoose.model('Post', postSchema);

function validatePost(post) {
    const schema = {
        title: Joi.string().min(5).max(255).required().error(new Error('post.pvm0001')),
        content: Joi.string().min(5).required().error(new Error('post.pvm0002')),
        imgPath: Joi.string().error(new Error('post.pvm0008')),
        tags: Joi.array().items(Joi.string()).error(new Error('post.pvm0009')),
        isPublished: Joi.boolean().error(new Error('post.pvm0003'))
    }
    return Joi.validate(post, schema);
}

function validateUpdate(req) {
    const schema = {
        title: Joi.string().min(5).max(255).error(new Error('post.pvm0001')),
        content: Joi.string().min(5).error(new Error('post.pvm0002')),
        imgPath: Joi.string().error(new Error('post.pvm0008')),
        tags: Joi.array().items(Joi.string()).error(new Error('post.pvm0009')),
        isPublished: Joi.boolean().error(new Error('post.pvm0003'))
    }
    return Joi.validate(req, schema);
}

exports.Post = Post;
exports.validate = validatePost;
exports.validateUpdate = validateUpdate;
