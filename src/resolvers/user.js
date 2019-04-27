const jwt = require('jsonwebtoken');
const { combineResolvers } = require('graphql-resolvers');
const { AuthenticationError, UserInputError } = require('apollo-server');

const { isAdmin, isAuthenticated } = require('./authorization');

const createToken = async (user, secret, expiresIn) => {
  const { id, email, username, role } = user;
  return await jwt.sign({ id, email, username, role }, secret, {
    expiresIn,
  });
};

// Queries

const find = async (parent, args, { models }) => {
  return await models.User.findAll();
};

const findOne = async (parent, { id }, { models }) => {
  return await models.User.findByPk(id);
}

const me = async (parent, args, { models, me }) => {
  if (!me) {
    return null;
  }

  return await models.User.findByPk(me.id);
};

// Mutations

const signUp = async (
  parent,
  { username, email, password },
  { models, secret },
) => {
  const user = await models.User.create({
    username,
    email,
    password,
  });

  return { token: createToken(user, secret, '30m') };
};

const signIn = async (
  parent,
  { login, password },
  { models, secret },
) => {
  const user = await models.User.findByLogin(login);

  if (!user) {
    throw new UserInputError(
      'No user found with this login credentials.',
    );
  }

  const isValid = await user.validatePassword(password);

  if (!isValid) {
    throw new AuthenticationError('Invalid password.');
  }

  return { token: createToken(user, secret, '30m') };
};

const findOneAndUpdate = async (parent, { username }, { models, me }) => {
  const user = await models.User.findByPk(me.id);
  return await user.update({ username });
};

const findOneAndDelete = async (parent, { id }, { models }) => {
  return await models.User.destroy({
    where: { id },
  });
};

const listUserMessages = async (user, args, { models }) => {
  return await models.Message.findAll({
    where: {
      userId: user.id,
    },
  })
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
    updateUser: combineResolvers(
      isAuthenticated,
      findOneAndUpdate,
    ),
    deleteUser: combineResolvers(
      isAdmin,
      findOneAndDelete
    ),
  },

  User: {
    messages: listUserMessages
  },
};
