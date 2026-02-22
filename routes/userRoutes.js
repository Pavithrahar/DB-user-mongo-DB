const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  deleteUser,
  getProfile,
  updateProfile
} = require("../controllers/userController");

const { protect, admin } = require("../middleware/authMiddleware");

// Admin routes
router.get("/", protect, admin, getAllUsers);
router.delete("/:id", protect, admin, deleteUser);

// User routes
router.get("/me", protect, getProfile);
router.patch("/me", protect, updateProfile);

module.exports = router;