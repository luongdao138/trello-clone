const CustomError = require('./CustomError');
const { StatusCodes } = require('http-status-codes');

class NotFoundError extends CustomError {
  constructor(msg) {
    super(msg);
    this.status = StatusCodes.NOT_FOUND;
  }
}

module.exports = NotFoundError;
