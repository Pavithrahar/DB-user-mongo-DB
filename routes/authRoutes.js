const express = require("express");
const router = express.Router();

const {
  register,
  login,
  refreshToken,
  logout,
} = require("../controllers/authController");

// Register new user
router.post("/register", register);

// Login user
router.post("/login", login);

// Get new access token using refresh token
router.post("/refresh-token", refreshToken);

// Logout user (invalidate refresh token)
router.post("/logout", logout);

module.exports = router;
