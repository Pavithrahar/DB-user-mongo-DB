const User = require("../models/User");
const Withdrawal = require("../models/Withdrawal");
const Transaction = require("../models/Transaction");
const Wallet = require("../models/Wallet");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// Admin Register

const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: "Admin already exists" });

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashed, isAdmin: true });

    res.json({ success: true, message: "Admin registered" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Admin Login

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await User.findOne({ email, isAdmin: true });
    if (!admin)
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match)
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });

    const accessToken = jwt.sign(
      { id: admin._id, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { id: admin._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Admin Dashboard Stats

const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isAdmin: false });
    const totalWithdrawals = await Withdrawal.countDocuments();
    const pendingWithdrawals = await Withdrawal.countDocuments({ status: "pending" });
    const approvedWithdrawals = await Withdrawal.countDocuments({ status: "approved" });

    res.json({
      success: true,
      stats: { totalUsers, totalWithdrawals, pendingWithdrawals, approvedWithdrawals },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Get All Users

const getUsers = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }).select("-password");
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Get Pending Withdrawals

const getPendingWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ status: "pending" }).populate("user", "name email");
    res.json({ success: true, withdrawals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Approve Withdrawal

const approveWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;

    const withdrawal = await Withdrawal.findById(id);
    if (!withdrawal)
      return res.status(404).json({ success: false, message: "Withdrawal not found" });

    if (withdrawal.status === "approved")
      return res.status(400).json({ success: false, message: "Withdrawal already approved" });

    const wallet = await Wallet.findOne({ userId: withdrawal.user });
    if (!wallet)
      return res.status(404).json({ success: false, message: "User wallet not found" });

    const assetIndex = wallet.assets.findIndex(a => a.assetType === withdrawal.assetType);
    if (assetIndex === -1)
      return res.status(400).json({ success: false, message: "Asset not found in wallet" });

    const asset = wallet.assets[assetIndex];

    if (asset.lockedBalance < withdrawal.amount)
      return res.status(400).json({ success: false, message: "Insufficient locked balance" });

    asset.lockedBalance -= withdrawal.amount;
    asset.availableBalance -= withdrawal.amount;

    wallet.assets[assetIndex] = asset;
    await wallet.save();

    withdrawal.status = "approved";
    withdrawal.approvedAt = new Date();
    await withdrawal.save();

    res.json({ success: true, message: "Withdrawal approved successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Helper: Build Filters

const buildFilters = (query) => {
  const filters = {};
  if (query.userId) filters.user = mongoose.Types.ObjectId(query.userId);
  if (query.assetType) filters.assetType = query.assetType;
  if (query.transactionType) filters.transactionType = query.transactionType;
  if (query.status) filters.status = query.status;
  if (query.startDate || query.endDate) {
    filters.createdAt = {};
    if (query.startDate) filters.createdAt.$gte = new Date(query.startDate);
    if (query.endDate) filters.createdAt.$lte = new Date(query.endDate);
  }
  return filters;
};


// Transaction Summary

const getTransactionSummary = async (req, res) => {
  try {
    const filters = buildFilters(req.query);
    const summary = await Transaction.aggregate([
      { $match: filters },
      { $group: { _id: "$transactionType", totalAmount: { $sum: "$amount" }, count: { $sum: 1 } } }
    ]);
    res.json({ success: true, summary });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Fees & GST

const getFeesAndGST = async (req, res) => {
  try {
    const filters = buildFilters(req.query);
    const feesGST = await Transaction.aggregate([
      { $match: { ...filters, transactionType: { $in: ["Fee", "GST"] } } },
      { $group: { _id: "$transactionType", totalAmount: { $sum: "$amount" } } }
    ]);
    res.json({ success: true, feesGST });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Total Assets

const getTotalAssets = async (req, res) => {
  try {
    const wallets = await Wallet.find({});
    const totalAssets = wallets.reduce((acc, w) => {
      if (!w.assets) return acc;
      w.assets.forEach(a => {
        acc[a.assetType] = (acc[a.assetType] || 0) + (a.availableBalance || 0);
      });
      return acc;
    }, {});
    res.json({ success: true, totalAssets });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getStats,
  getUsers,
  getPendingWithdrawals,
  approveWithdrawal,
  getTransactionSummary,
  getFeesAndGST,
  getTotalAssets
};