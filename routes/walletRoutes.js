const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletController");
const { protect } = require("../middleware/authMiddleware"); // JWT auth

// Deposit
router.post("/deposit", protect, walletController.createDeposit);

// Withdraw
router.post("/withdraw", protect, walletController.createWithdrawal);

module.exports = router;