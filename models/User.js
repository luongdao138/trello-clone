const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Name cannot be empty!'],
      trim: true,
      minlength: [3, 'Name cannot be less than 3 characters!'],
      maxlength: [50, 'Name cannot be more than 50 characters!'],
    },
    email: {
      type: String,
      required: [true, 'Email cannot be empty!'],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Invalid email!',
      ],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password cannot be empty!'],
    },
    avatar: String,
    bio: String,
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.generateToken = function () {
  return jwt.sign({ _id: this._id }, process.env.ACCESS_TOKEN, {
    expiresIn: '15d',
  });
};

UserSchema.methods.comparePw = async function (password) {
  const isPwValid = await bcrypt.compare(password, this.password);
  return isPwValid;
};

module.exports = model('User', UserSchema);
