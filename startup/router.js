const indexRouter = require('../routes/index');
const usersRouter = require('../routes/users');
const postRouter = require('../routes/post');
const usersApiRouter = require('../routes/api/users');
const authApiRouter = require('../routes/api/auth');
const postApiRouter = require('../routes/api/post');
const uploadRouter = require('../routes/api/upload');

module.exports = function (app) {
    app.use('/', indexRouter);
    app.use('/users', usersRouter);

    /* API ROUTER*/
    app.use('/api/users', usersApiRouter);
    app.use('/api/auth', authApiRouter);
    app.use('/api/posts', postApiRouter);
    app.use('/api/upload', uploadRouter);

    /* PAGE ROUTER */
    app.use('/posts', postRouter);
}