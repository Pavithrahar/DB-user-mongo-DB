const Withdrawal = require("../models/Withdrawal");
const Wallet = require("../models/Wallet");
const FeeConfig = require("../models/FeeConfig");


// Request Withdrawal (User)

const createWithdrawal = async (req, res) => {
  try {
    const { assetType, amount, destinationWallet, remarks } = req.body;
    if (!assetType || !amount || !destinationWallet)
      return res.status(400).json({ success: false, message: "All fields required" });

    let wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) return res.status(400).json({ success: false, message: "Wallet not found" });

    let asset = wallet.assets.find(a => a.assetType === assetType);
    if (!asset || asset.availableBalance < amount)
      return res.status(400).json({ success: false, message: "Insufficient balance" });

    // Lock the requested amount
    asset.availableBalance -= amount;
    asset.lockedBalance += amount;
    await wallet.save();

    const withdrawal = await Withdrawal.create({
      userId: req.user._id,
      assetType,
      amount,
      destinationWallet,
      remarks,
    });

    res.status(201).json({ success: true, message: "Withdrawal requested", data: withdrawal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Admin Approve/Reject Withdrawal

const updateWithdrawalStatus = async (req, res) => {
  try {
    const { status, adminRemarks } = req.body;
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) return res.status(404).json({ success: false, message: "Withdrawal not found" });

    withdrawal.status = status;
    withdrawal.adminRemarks = adminRemarks || "";
    await withdrawal.save();

    // Update wallet balances
    let wallet = await Wallet.findOne({ userId: withdrawal.userId });
    let asset = wallet.assets.find(a => a.assetType === withdrawal.assetType);

    if (status === "APPROVED") {
      asset.lockedBalance -= withdrawal.amount;
    } else if (status === "REJECTED") {
      asset.lockedBalance -= withdrawal.amount;
      asset.availableBalance += withdrawal.amount;
    }

    await wallet.save();

    res.json({ success: true, message: `Withdrawal ${status.toLowerCase()} successfully`, data: withdrawal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Admin: Get all withdrawals

const getAllWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find().sort({ createdAt: -1 });
    res.json({ success: true, data: withdrawals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createWithdrawal, updateWithdrawalStatus, getAllWithdrawals };