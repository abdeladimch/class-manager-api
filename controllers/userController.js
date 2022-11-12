const User = require("../models/User");
const CustomError = require("../errors");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const checkPerms = require("../utils/checkPerms");
const jwt = require("../utils");

const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  if (!users) {
    throw new CustomError.NotFoundError("No users found!");
  }
  res
    .status(StatusCodes.OK)
    .json({ status: "Success!", users, count: users.length });
};

const getSingleUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findOne({ _id: userId }).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError(`No user found with id ${userId}`);
  }
  checkPerms(req.user, userId);
  res.status(StatusCodes.OK).json({ status: "Success!", user });
};

const showMe = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  const userToken = jwt.createToken(user);
  res.status(StatusCodes.OK).json({ status: "Success!", user: userToken });
};

const updateUser = async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    throw new CustomError.BadRequestError(
      "Name and email fields cannot be empty!"
    );
  }
  const user = await User.findOne({ _id: req.user.userId }).select("-password");

  checkPerms(req.user, req.user.userId);
  user.name = name;
  user.email = email;
  user.role = req.user.role;

  await user.save();

  res.status(StatusCodes.OK).json({ status: "Success!", user });
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError(
      "Old Password and new Password are required!"
    );
  }
  const user = await User.findOne({ _id: req.user.userId });
  if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
    throw new CustomError.UnauthenticatedError("Invalid credentials");
  }
  checkPerms(req.user, req.user.userId);
  user.password = newPassword;
  await user.save();

  res
    .status(StatusCodes.OK)
    .json({ status: "Success!", msg: "Password updeted!" });
};

const deleteUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findOne({ _id: req.user.userId });
  if (!user) {
    throw new CustomError.NotFoundError(`Coudl'nt find user with id ${userId}`);
  }
  checkPerms(req.user, req.user.userId);
  await user.remove();
  res.status(StatusCodes.OK).json({ status: "Success!", msg: "User removed!" });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showMe,
  updateUser,
  updateUserPassword,
  deleteUser,
};
