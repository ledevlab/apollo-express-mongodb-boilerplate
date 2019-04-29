const config = {
  app: {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    secret: process.env.SECRET,
  },
  mongo: {
    uri: process.env.MONGO_URL,
    dbName: process.env.MONGO_DB_NAME,
  }
};

module.exports = config;
