const express = require("express");
const router = express.Router();

const {
  createWithdrawal,
  getUserWithdrawals,
  getAllWithdrawals,
  approveWithdrawal,
  rejectWithdrawal
} = require("../controllers/withdrawalController");

const { protect, admin } = require("../middleware/authMiddleware");

// User creates withdrawal
router.post("/", protect, createWithdrawal);

// User withdrawal history
router.get("/my", protect, getUserWithdrawals);

// Admin view all withdrawals
router.get("/", protect, admin, getAllWithdrawals);

// Admin approve withdrawal
router.put("/:id/approve", protect, admin, approveWithdrawal);

// Admin reject withdrawal
router.put("/:id/reject", protect, admin, rejectWithdrawal);

module.exports = router;