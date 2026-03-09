const express = require("express");
const router = express.Router();
const userDataController = require("../controllers/userDataController");

// Create new user data
router.post("/", userDataController.createUserData);

// Get all user data
router.get("/", userDataController.getAllUserData);

// Get single user data by ID
router.get("/:id", userDataController.getUserDataById);

// Update user data by ID
router.put("/:id", userDataController.updateUserData);

// Delete user data by ID
router.delete("/:id", userDataController.deleteUserData);

module.exports = router;