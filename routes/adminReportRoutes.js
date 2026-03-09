const express = require("express");
const router = express.Router();

const {
  getTotalDeposits,
  getTotalWithdrawals,
  getTotalAssets
} = require("../controllers/adminReportController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");


router.get(
  "/deposits",
  protect,
  authorizeRoles("admin","superadmin"),
  getTotalDeposits
);

router.get(
  "/withdrawals",
  protect,
  authorizeRoles("admin","superadmin"),
  getTotalWithdrawals
);

router.get(
  "/assets",
  protect,
  authorizeRoles("admin","superadmin"),
  getTotalAssets
);

module.exports = router;