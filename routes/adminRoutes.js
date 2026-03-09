const express = require("express");
const router = express.Router();

const {
  registerAdmin,
  loginAdmin,
  getStats,
  getUsers,
  getPendingWithdrawals,
  approveWithdrawal,
  getTransactionSummary,
  getFeesAndGST,
  getTotalAssets
} = require("../controllers/adminController");

const { protect, admin } = require("../middleware/authMiddleware");

// Admin register/login
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// Admin dashboard
router.get("/stats", protect, admin, getStats);
router.get("/users", protect, admin, getUsers);
router.get("/pending-withdrawals", protect, admin, getPendingWithdrawals);

// Approve withdrawal
router.patch("/withdraw/:id/approve", protect, admin, approveWithdrawal);

// Admin reporting
router.get("/transactions/summary", protect, admin, getTransactionSummary);
router.get("/transactions/fees-gst", protect, admin, getFeesAndGST);
router.get("/assets/total", protect, admin, getTotalAssets);

module.exports = router;