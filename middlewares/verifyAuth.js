const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors');
const User = require('../models/User');

const verifyAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Token not provided!');
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    const { _id } = decoded;
    const user = await User.findById(_id);
    const authUser = { ...user._doc, _id };
    delete authUser.password;
    req.user = authUser;
    next();
  } catch (error) {
    throw new UnauthorizedError('Not authorized to access this route!');
  }
};

module.exports = verifyAuth;
