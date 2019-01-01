var debug = require('debug')('app:db');
const config = require('config');
const mongoose = require('mongoose');

const host = config.get('dbConfig.host');
const port = config.get('dbConfig.port');
const dbName = config.get('dbConfig.dbName');
const username = config.get('dbConfig.username');
const password = config.get('dbConfig.password');

let connectionString = `mongodb://${username}:${password}@${host}:${port}/${dbName}?authSource=admin`;

module.exports.connectionString = connectionString;

module.exports.connect = function() {
    mongoose.connect(connectionString, {
          useNewUrlParser: true
    }).then(() => debug('Connected to mongodb.'));
};
