const mongoose = require('mongoose');
const User = require('./user');

const connectDb = (uri) => {
  return mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
  });
};

const models = {
  User,
};

module.exports = {
  models,
  connectDb,
  ObjectId: mongoose.mongo.ObjectId,
};
