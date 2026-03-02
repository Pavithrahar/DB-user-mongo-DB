const express = require("express");
const router = express.Router();
const { registerUser, loginUser, refreshToken } = require("../controllers/authController");

// Register user/admin
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Refresh token
router.post("/refresh", refreshToken);

module.exports = router;