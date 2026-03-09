const express = require("express");
const router = express.Router();

const notificationController = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

// Get all notifications
router.get("/", protect, notificationController.getNotifications);

// Mark notification as read
router.put("/:id/read", protect, notificationController.markAsRead);

module.exports = router;