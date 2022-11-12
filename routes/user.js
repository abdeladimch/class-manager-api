const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getSingleUser,
  updateUser,
  updateUserPassword,
  deleteUser,
  showMe,
} = require("../controllers/userController");

const {
  showMyClassesTeacher,
  showMyClassesStudent,
} = require("../controllers/classController");

const { authUser, authPerms } = require("../middlewares/authMiddleware");

router.route("/").get(authUser, authPerms("teacher"), getAllUsers);
router.route("/showMe").get(authUser, showMe);
router
  .route("/showMyClassesTeacher")
  .get(authUser, authPerms("teacher"), showMyClassesTeacher);
router.route("/showMyClassesStudent").get(authUser, showMyClassesStudent);
router.route("/:id").get(authUser, getSingleUser);
router.route("/updateUser").patch(authUser, updateUser);
router.route("/updateUserPassword").patch(authUser, updateUserPassword);
router.route("/:id").delete(authUser, deleteUser);

module.exports = router;
