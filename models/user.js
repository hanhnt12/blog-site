const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
        unique: true
    },
    isAdmin: Boolean
});

userSchema.methods.isValidPassword = async function (reqPassword) {
    if (!reqPassword) {
        return false;
    }
    const result = await bcrypt.compare(reqPassword, this.password);
    return result;
}

userSchema.methods.generateToken = function () {
    const token = jwt.sign({
        _id: this._id,
        isAdmin: this.isAdmin
    }, config.get('authConfig.jwtPrivateKey'));
    return token;
}

userSchema.methods.hashPassword = async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
}

userSchema
    .virtual('detailUrl')
    .get(function() {
        return config.get('users.prefixUrlDetail') + '/' + this._id
    });

userSchema
    .virtual('detailUrlApi')
    .get(function() {
        return config.get('users.prefixUrlDetailApi') + '/' + this._id
    });

const User = mongoose.model('User', userSchema);

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
