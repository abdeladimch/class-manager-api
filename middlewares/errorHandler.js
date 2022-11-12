const { StatusCodes } = require("http-status-codes");

const errorHandler = async (err, req, res, next) => {
  const errorObj = {
    message: err.message || "Something went wrong!",
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  };
  if (err.message.includes("validation failed")) {
    errorObj.message = err.message
      .slice(err.message.indexOf(":") + 1)
      .split(",")
      .map((item) => item.split(": ")[1])
      .join(" ");
    errorObj.statusCode = StatusCodes.BAD_REQUEST;
  }
  if (err.message.startsWith("Cast")) {
    errorObj.message = "Invalid id for this resource!";
    errorObj.statusCode = StatusCodes.BAD_REQUEST;
  }
  if (err.message.includes("E11000")) {
    errorObj.message = "An account with this email already exist!";
    errorObj.statusCode = StatusCodes.BAD_REQUEST;
  }

  res.status(errorObj.statusCode).json({ msg: errorObj.message });
};

module.exports = errorHandler;
