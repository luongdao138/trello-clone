const User = require('../models/User');
const { verifyLogin, verifyRegister } = require('../helpers/validateData');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthorizedError } = require('../errors');

module.exports = {
  login: async (req, res) => {
    const errors = verifyLogin(req.body);
    if (Object.keys(errors).length) {
      throw new BadRequestError(errors[Object.keys(errors)[0]]);
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new UnauthorizedError('Invalid credentials!');
    }
    const isPwValid = await user.comparePw(req.body.password);
    if (!isPwValid) {
      throw new UnauthorizedError('Invalid credentials!');
    }

    const returnUser = { ...user._doc };
    delete returnUser.password;
    const token = user.generateToken();
    res.status(StatusCodes.OK).json({ user: returnUser, token });
  },
  register: async (req, res) => {
    const errors = verifyRegister(req.body);
    if (Object.keys(errors).length) {
      throw new BadRequestError(errors[Object.keys(errors)[0]]);
    }
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      throw new BadRequestError('Email already exists!');
    }

    let newUser = new User(req.body);
    newUser = await newUser.save();
    const returnUser = { ...newUser._doc };
    delete returnUser.password;
    const token = newUser.generateToken();
    res.status(StatusCodes.CREATED).json({ user: returnUser, token });
  },
};
