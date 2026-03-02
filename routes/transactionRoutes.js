const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  getAllTransactions,
  getSingleTransaction,
} = require("../controllers/transactionController");

// Get all transactions (user)
router.get("/", protect, getAllTransactions);

// Get single transaction (user)
router.get("/:type/:id", protect, getSingleTransaction); // type = deposit or withdrawal

module.exports = router;