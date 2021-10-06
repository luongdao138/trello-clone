const CustomError = require('./CustomError');
const { StatusCodes } = require('http-status-codes');

class UnauthorizedError extends CustomError {
  constructor(msg) {
    super(msg);
    this.status = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = UnauthorizedError;
