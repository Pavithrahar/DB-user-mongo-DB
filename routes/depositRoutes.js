const express = require("express");
const router = express.Router();

const {
  createDeposit,
  getMyDeposits,
  getAllDeposits,
  approveDeposit,
  rejectDeposit,
  getWalletBalance
} = require("../controllers/depositController");

const { protect, admin } = require("../middleware/authMiddleware");

// User routes
router.post("/", protect, createDeposit);
router.get("/my", protect, getMyDeposits);
router.get("/wallet", protect, getWalletBalance);

// Admin routes
router.get("/", protect, admin, getAllDeposits);
router.patch("/:id/approve", protect, admin, approveDeposit);
router.patch("/:id/reject", protect, admin, rejectDeposit);

module.exports = router;