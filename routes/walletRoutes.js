const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getUserWallet } = require("../controllers/walletController");

// GET /api/wallets → get all assets of logged-in user
router.get("/", protect, getUserWallet);

module.exports = router;