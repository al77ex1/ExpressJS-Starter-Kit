const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const validateJsonSyntax = () => {
  return function (error, req, res, next) {
    if (error instanceof SyntaxError) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Invalid JSON: The server is unable to process your request as it is badly malformed!'
      );
    }
    return next();
  };
};
module.exports = validateJsonSyntax;
