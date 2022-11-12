const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  verifyEmail,
  logout,
} = require("../controllers/authController");

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/verify-email").get(verifyEmail);
router.route("/logout").get(logout);

module.exports = router;
