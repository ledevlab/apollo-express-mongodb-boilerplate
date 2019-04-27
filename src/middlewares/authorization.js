const jwt = require('jsonwebtoken');

const {
  AuthenticationError,
} = require('apollo-server-express');

async function getMe(req) {
  const token = req.headers['x-token'];

  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new AuthenticationError(
        'Your session expired. Sign in again.',
      );
    }
  }
};


module.export = {
  getMe
};
