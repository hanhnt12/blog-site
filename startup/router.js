var indexRouter = require('../routes/index');
var usersRouter = require('../routes/users');
var usersApiRouter = require('../routes/api/users');
var authApiRouter = require('../routes/api/auth');
var postApiRouter = require('../routes/api/post');

module.exports = function (app) {
    app.use('/', indexRouter);
    app.use('/users', usersRouter);

    /* API ROUTER*/
    app.use('/api/users', usersApiRouter);
    app.use('/api/auth', authApiRouter);
    app.use('/api/posts', postApiRouter);
}