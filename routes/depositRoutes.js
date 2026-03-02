const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const {
  createDeposit,
  getAllDeposits,
  updateDepositStatus,
} = require("../controllers/depositController");

// User: Create deposit
router.post("/", protect, upload.single("assetProof"), createDeposit);

// User: Get all deposits
router.get("/", protect, getAllDeposits);

// Admin: Approve deposit
router.patch(
  "/:id/approve",
  protect,
  admin,
  (req, res, next) => {
    req.body.status = "APPROVED";
    next();
  },
  updateDepositStatus
);

// Admin: Reject deposit
router.patch(
  "/:id/reject",
  protect,
  admin,
  (req, res, next) => {
    req.body.status = "REJECTED";
    next();
  },
  updateDepositStatus
);

module.exports = router;