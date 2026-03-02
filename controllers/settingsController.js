const Setting = require("../models/FeeSetting");

// Get all settings
const getAllSettings = async (req, res) => {
  try {
    const settings = await Setting.find({});
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create or update a setting
const createOrUpdateSetting = async (req, res) => {
  try {
    const { assetType, feePercent, gstPercent, feeEnabled } = req.body;
    if (!assetType) {
      return res.status(400).json({ success: false, message: "assetType required" });
    }

    let setting = await Setting.findOne({ assetType });
    if (!setting) {
      setting = new Setting({ assetType, feePercent, gstPercent, feeEnabled });
    } else {
      setting.feePercent = feePercent ?? setting.feePercent;
      setting.gstPercent = gstPercent ?? setting.gstPercent;
      setting.feeEnabled = feeEnabled ?? setting.feeEnabled;
    }

    await setting.save();
    res.json({ success: true, data: setting });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single asset setting
const getSettingByAsset = async (req, res) => {
  try {
    const { assetType } = req.params;
    const setting = await Setting.findOne({ assetType });
    if (!setting) return res.status(404).json({ success: false, message: "Setting not found" });

    res.json({ success: true, data: setting });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllSettings,
  createOrUpdateSetting,
  getSettingByAsset,
};