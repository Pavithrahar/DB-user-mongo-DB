const express = require("express");
const router = express.Router();

const { protect, admin } = require("../middleware/authMiddleware");

const {
  getUserLedger,
  getAllLedger
} = require("../controllers/ledgerController");


// User: Get own ledger
router.get("/user", protect, getUserLedger);


// Admin: Get all ledger transactions
router.get("/admin/all", protect, admin, getAllLedger);


module.exports = router;

