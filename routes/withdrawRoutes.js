const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  createWithdrawal,
  updateWithdrawalStatus,
  getAllWithdrawals
} = require("../controllers/withdrawalController");

// User: request withdrawal
router.post("/", protect, createWithdrawal);

// Admin: approve withdrawal
router.patch("/:id/approve", protect, admin, (req, res, next) => {
  req.body.status = "APPROVED";
  next();
}, updateWithdrawalStatus);

// Admin: reject withdrawal
router.patch("/:id/reject", protect, admin, (req, res, next) => {
  req.body.status = "REJECTED";
  next();
}, updateWithdrawalStatus);

// Admin: get all withdrawals
router.get("/", protect, admin, getAllWithdrawals);

module.exports = router;