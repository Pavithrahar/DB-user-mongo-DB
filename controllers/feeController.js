const FeeConfig = require("../models/FeeConfig");

// Create fee
const createFee = async (req, res) => {
  try {
    const { assetType, feePercentage, gstPercentage, isFeeEnabled } = req.body;
    const fee = await FeeConfig.create({ assetType, feePercentage, gstPercentage, isFeeEnabled });
    res.status(201).json({ success: true, message: "Fee configuration saved", data: fee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update fee
const updateFee = async (req, res) => {
  try {
    const fee = await FeeConfig.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!fee) return res.status(404).json({ success: false, message: "Fee config not found" });
    res.json({ success: true, message: "Fee configuration updated", data: fee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all fees
const getAllFees = async (req, res) => {
  try {
    const fees = await FeeConfig.find();
    res.json({ success: true, data: fees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createFee, updateFee, getAllFees };