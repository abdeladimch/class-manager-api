const express = require("express");
const router = express.Router();

const {
  createClass,
  getAllClasses,
  getSingleClass,
  updateClass,
  deleteClass,
} = require("../controllers/classController");

const { authUser, authPerms } = require("../middlewares/authMiddleware");

router
  .route("/")
  .get(authUser, authPerms("teacher"), getAllClasses)
  .post(authUser, authPerms("teacher"), createClass);

router
  .route("/:id")
  .get(authUser, getSingleClass)
  .patch(authUser, updateClass)
  .delete(authUser, deleteClass);

module.exports = router;
