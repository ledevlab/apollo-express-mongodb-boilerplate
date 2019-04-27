const { PubSub } = require('apollo-server');

const MESSAGE_EVENTS = require('./message');

const EVENTS = {
  MESSAGE: MESSAGE_EVENTS,
};

module.exports = {
  EVENTS,
  pubsub: new PubSub(),
}
