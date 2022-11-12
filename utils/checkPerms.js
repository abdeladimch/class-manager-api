const CustomError = require("../errors");

const checkPerms = (reqUser, resourceId) => {
  if (reqUser.role === "teacher" || reqUser.userId === resourceId.toString())
    return;
  throw new CustomError.UnauthorizedError(
    "Unauthorized to access this resource!"
  );
};

module.exports = checkPerms;
