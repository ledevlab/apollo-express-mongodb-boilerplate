#!/usr/bin/env node
require('dotenv').load({ silent: true });
const logger = require('debug')('http');

const cors = require('cors');
const http = require('http');
const DataLoader = require('dataloader');
const express = require('express');

const { ApolloServer } = require('apollo-server-express');

const config = require('./config.js');

const schema = require('./schema');
const resolvers = require('./resolvers');
const loaders = require('./loaders');

const { models, connectDb, ObjectId } = require('./models');
const { getMe } = require('./middlewares/authorization');

const app = express();

app.use(cors());

const server = new ApolloServer({
  introspection: true,
  playground: true,
  typeDefs: schema,
  resolvers,
  formatError: error => {
    // remove the internal sequelize error message
    // leave only the important validation error
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '');

    return {
      ...error,
      message,
    };
  },
  context: async ({ req, connection }) => {
    if (connection) {
      return {
        models,
        loaders: {
          user: new DataLoader(keys =>
            loaders.user.batchUsers(keys, models)
          ),
        },
      };
    }

    if (req) {
      const me = await getMe(req);

      return {
        models,
        me,
        secret: config.app.secret,
        loaders: {
          user: new DataLoader(keys =>
            loaders.user.batchUsers(keys, models)
          ),
        },
      };
    }
  },
});

server.applyMiddleware({ app, path: '/graphql' });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

connectDb(`${config.mongo.uri}/${config.mongo.dbName}`).then(
  async () => {
    const { port } = config.app;
    httpServer.listen({ port }, () => {
      logger(`Apollo Server on http://localhost:${port}/graphql`);
    });
  }
);
