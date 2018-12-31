var indexRouter = require('../routes/index');
var usersRouter = require('../routes/users');
var usersApiRouter = require('../routes/api/users');
var authApiRouter = require('../routes/api/auth');

module.exports = function (app) {
    app.use('/', indexRouter);
    app.use('/users', usersRouter);

    /* API ROUTER*/
    app.use('/api/users', usersApiRouter);
    app.use('/api/auth', authApiRouter);
}