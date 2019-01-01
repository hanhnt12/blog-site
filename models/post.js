const { generatePermarkLink } = require('../common/utils');
const Joi = require('joi');
const mongoose = require('mongoose');

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

postSchema.methods.incrementView = function () {
    this.view++;
}

postSchema
    .virtual('detailUrl')
    .get(function() {
        return config.get('posts.prefixUrlDetail') + '/' + this._id
    });

postSchema
    .virtual('detailUrlApi')
    .get(function() {
        return config.get('posts.prefixUrlDetailApi') + '/' + this._id
    });

const Post = mongoose.model('Post', postSchema);

function validatePost(post) {
    const schema = {
        title: Joi.string().min(5).max(255).required().error(new Error('post.pvm0001')),
        content: Joi.string().min(5).required().error(new Error('post.pvm0002'))
    }
    return Joi.validate(post, schema);
}

exports.Post = Post;
exports.validate = validatePost;
