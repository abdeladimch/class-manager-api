const CustomError = require("../errors");
const jwt = require("../utils");

const authUser = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies;

  if (!accessToken && !refreshToken) {
    throw new CustomError.UnauthenticatedError("Authentication failed!");
  }

  if (accessToken) {
    const decoded = jwt.verifyToken(accessToken);
    req.user = decoded;
    return next();
  }
  const decoded = jwt.verifyToken(refreshToken);
  req.user = decoded.userToken;
  jwt.attachCookiesToRes(res, decoded.userToken, decoded.refreshToken);
  next();
};

const authPerms = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        "Unauthorized to access this resource!"
      );
    }
    next();
  };
};

module.exports = { authUser, authPerms };
