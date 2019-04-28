const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'ADMIN'
  }
});

schema.statics.findByLogin = async function(login) {
  let user = await User.findOne({ username: login });

  if (!user) {
    user = await User.findOne({ email: login });
  }

  return user;
};

schema.methods.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

schema.pre('save', async function() {
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
});

const User = mongoose.model('User', schema);

module.exports = User;
