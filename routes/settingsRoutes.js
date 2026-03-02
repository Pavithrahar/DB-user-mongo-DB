const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  getAllSettings,
  createOrUpdateSetting,
  getSettingByAsset,
} = require("../controllers/settingsController");

// Admin only: Get all fee/GST settings
router.get("/", protect, admin, getAllSettings);

// Admin only: Create or update a setting for an asset
router.post("/", protect, admin, createOrUpdateSetting);

// Admin only: Get single asset setting
router.get("/:assetType", protect, admin, getSettingByAsset);

module.exports = router;