const jwt = require("jsonwebtoken");
require("dotenv").config();

const genJWT = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET);
};

const createToken = (user) => {
  return { name: user.name, role: user.role, userId: user._id };
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const attachCookiesToRes = (res, userToken, refreshToken) => {
  const accessTokenJWT = genJWT(userToken);
  const refreshTokenJWT = genJWT({ userToken, refreshToken });

  const oneMonth = 1000 * 3600 * 24 * 30;

  res.cookie("accessToken", accessTokenJWT, {
    maxAge: 1000 * 60 * 15, 
    secure: process.env.NODE_ENV === "production",
    signed: true,
    httpOnly: true,
  });

  res.cookie("refreshToken", refreshTokenJWT, {
    expires: new Date(Date.now() + oneMonth),
    secure: process.env.NODE_ENV === "production",
    signed: true,
    httpOnly: true,
  });
};

module.exports = { genJWT, createToken, verifyToken, attachCookiesToRes };
