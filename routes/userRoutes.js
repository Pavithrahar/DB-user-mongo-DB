const express = require("express");
const router = express.Router();
const { getProfile, registerUser, loginUser, refreshToken } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// User registration & login
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshToken);

// Protected Profile route
router.get("/profile", protect, getProfile);

module.exports = router;