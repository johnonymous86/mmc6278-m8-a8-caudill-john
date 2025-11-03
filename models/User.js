const { Schema, model, models } = require('mongoose');
const bcrypt = require('bcrypt')

const UserSchema = new Schema({
  //credentials
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 20
  }
});

// hash password 
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
    return;
  }
  this.password = await bcrypt.hash(this.password, 10)
  next()
});

module.exports = models.User || model('User', UserSchema);