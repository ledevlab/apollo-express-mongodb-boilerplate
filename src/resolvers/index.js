const { GraphQLDateTime } = require('graphql-iso-date');

const userResolvers = require('./user');

const customScalarResolver = {
  Date: GraphQLDateTime,
};

module.exports = [
  customScalarResolver,
  userResolvers,
]
