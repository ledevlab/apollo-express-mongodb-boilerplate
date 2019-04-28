const batchUsers = async (keys, models) => {
  const users = await models.User.find({
    id: {
      $in: keys,
    },
  });

  return keys.map(key => users.find(user => user.id === key));
};

module.exports = {
  batchUsers
};
