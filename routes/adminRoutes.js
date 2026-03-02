const express = require("express");
const router = express.Router();

const { getAllDeposits, approveDeposit, rejectDeposit } = require("../controllers/adminDepositController");
const { protect, admin } = require("../middleware/authMiddleware");

// Admin deposits
router.get("/deposits", protect, admin, getAllDeposits);
router.patch("/deposits/:id/approve", protect, admin, approveDeposit);
router.patch("/deposits/:id/reject", protect, admin, rejectDeposit);

module.exports = router;