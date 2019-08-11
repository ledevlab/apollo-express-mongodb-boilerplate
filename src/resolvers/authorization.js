const { ForbiddenError } = require('apollo-server');
const { combineResolvers, skip } = require('graphql-resolvers');

const isAuthenticated = (_, args, { me }) =>
  me ? skip : new ForbiddenError('Not authenticated as user.');

const isAdmin = combineResolvers(
  isAuthenticated,
  (_, args, { me: { role } }) =>
    role === 'ADMIN'
      ? skip
      : new ForbiddenError('Not authorized as admin.')
);

module.exports = {
  isAuthenticated,
  isAdmin,
};
