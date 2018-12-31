var debug = require('debug')('app:db');
const config = require('config');
const mongoose = require('mongoose');

const host = config.get('dbConfig.host');
const port = config.get('dbConfig.port');
const dbName = config.get('dbConfig.dbName');
const username = config.get('dbConfig.username');
const password = config.get('dbConfig.password');

debug(`host: ${host}`);
debug(`port: ${port}`);
debug(`dbName: ${dbName}`);
debug(`username: ${username}`);
debug(`password: ${password}`);
debug(`Connection string: mongodb://${username}:${password}@${host}:${port}/${dbName}?authSource=admin`);

module.exports = function() {
  mongoose
    .connect(
      `mongodb://${username}:${password}@${host}:${port}/${dbName}?authSource=admin`,
      { useNewUrlParser: true }
    )
    .then(() => debug('Connected to mongodb.'));
};
