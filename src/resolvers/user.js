const jwt = require('jsonwebtoken');

const { combineResolvers } = require('graphql-resolvers');

const {
  AuthenticationError,
  UserInputError,
} = require('apollo-server');

const { isAdmin, isAuthenticated } = require('./authorization');

const createToken = async (user, secret, expiresIn) => {
  const { id, email, username, role } = user;
  return await jwt.sign({ id, email, username, role }, secret, {
    expiresIn,
  });
};

const find = async (_, args, { models }) => {
  return await models.User.find({});
};

const findOne = async (_, { id }, { models }) => {
  return await models.User.findById(id);
};

const me = async (_, args, { models, me }) => {
  if (!me) {
    return null;
  }
  return await models.User.findById(me.id);
};

const signUp = async (
  _,
  { username, email, password },
  { models, secret }
) => {
  const user = await models.User.create({
    username,
    email,
    password,
  });

  return { token: createToken(user, secret, '30m') };
};

const signIn = async (_, { login, password }, { models, secret }) => {
  const user = await models.User.findByLogin(login);

  if (!user) {
    throw new UserInputError(
      'No user found with this login credentials.'
    );
  }

  const isValid = await user.validatePassword(password);

  if (!isValid) {
    throw new AuthenticationError('Invalid password.');
  }

  return { token: createToken(user, secret, '30m') };
};

const findOneAndUpdate = async (_, { username }, { models, me }) => {
  const user = await models.User.findById(me.id);
  return await user.update({ username });
};

const findOneAndDelete = async (_, { id }, { models }) => {
  return await models.User.remove({ _id: id });
};

module.exports = {
  Query: {
    users: find,
    user: findOne,
    me: me,
  },

  Mutation: {
    signUp,
    signIn,
    updateUser: combineResolvers(isAuthenticated, findOneAndUpdate),
    deleteUser: combineResolvers(isAdmin, findOneAndDelete),
  },
};
