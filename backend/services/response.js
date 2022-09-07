const logger = require("./logger");

const message = (res, data, status = 200) => {
  res.status(status);
  return res.json({ data });
};

const success = message;

const error = (res, e, code = 500) => {
  logger.error(e);
  if (e.code) {
    code = e.code;
  }
  res.status(code);
  return res.json({
    data: null,
    error: e.message,
  });
};

const serveSuccess = (res) => {
  return (data) => {
    return success(res, data);
  };
};

const serveError = (res, code = 500) => {
  return (e) => {
    return error(res, e, code);
  };
};

module.exports = {
  message,
  success,
  error,
  serveSuccess,
  serveError,
  ErrorResponse: require("./error"),
};
