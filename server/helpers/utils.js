// Create a sendResponse helper. This function controls the way we response to the client.
// Both success and error. The reusability of this helper is very high so if we need to change the way to response later on, we only need to handle it here

const utilsHelper = {};

utilsHelper.sendResponse = (res, status, success, data, errors, message) => {
  const response = {};
  if (success) response.success = success;
  if (data) response.data = data;
  if (errors) response.errors = errors;
  if (message) response.message = message;
  return res.status(status).json(response);
};

// Create a AppError class inherits from javascript Error class so that it could be throw. Construct the class so that error made from this class will have different identifiers : isOperational, statusCode, and errorType than uncaught system error

class AppError extends Error {
  constructor(statusCode, message, errorType) {
    super(message);
    this.statusCode = statusCode;
    this.errorType = errorType;
    // all errors using this class are operational errors.
    this.isOperational = true;
    // create a stack trace for debugging (Error obj, void obj to avoid stack polution)
    Error.captureStackTrace(this, this.constructor);
  }
}

utilsHelper.AppError = AppError;
module.exports = utilsHelper;
