const Joi = require('joi');
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    content: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
        unique: true
    },
    isPublished: Boolean
});

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

const User = mongoose.model('User', postSchema);

function validateUser(user) {
    const schema = {
        name: Joi.string().min(5).max(255).required().error(new Error('user.uvm0001')),
        email: Joi.string().min(5).max(255).required().email().error(new Error('user.uvm0002')),
        password: Joi.string().min(5).max(255).required().error(new Error('user.uvm0003'))
    }
    return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
