var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const cors = require('cors')
const logger = require('./startup/logging');
var morgan = require('morgan');
const error = require('./middlewares/error');
const responseBuilder = require('./middlewares/responseBuilder');

var app = express();
app.use(cors());

// DB
require('./startup/db').connect();
// Logging
app.use(morgan('combined', { stream: logger.stream }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// boostrap, jquery, angular
app.use('/lib/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/lib/css', express.static(path.join(__dirname, '/node_modules/font-awesome/css')));
app.use('/lib/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/lib/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.use('/lib/js', express.static(path.join(__dirname, '/node_modules/angular')));
app.use('/lib/js', express.static(path.join(__dirname, '/node_modules/angular-route')));

// route
require('./startup/router')(app);

// build response API
app.all('*', responseBuilder);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    logger.info(`Catching error 404 - Not found...`);
    next(createError(404));
});

// error handler
app.use(error);

module.exports = app;
