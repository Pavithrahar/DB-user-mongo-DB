const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const { createFee, updateFee, getAllFees } = require("../controllers/feeController");

// Admin routes
router.post("/", protect, admin, createFee);
router.patch("/:id", protect, admin, updateFee);
router.get("/", protect, admin, getAllFees);

module.exports = router;