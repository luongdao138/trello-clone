const CustomError = require('./CustomError');
const { StatusCodes } = require('http-status-codes');

class BadRequestError extends CustomError {
  constructor(msg) {
    super(msg);
    this.status = StatusCodes.BAD_REQUEST;
  }
}

module.exports = BadRequestError;
