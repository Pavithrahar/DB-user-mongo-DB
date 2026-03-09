const mongoose = require("mongoose");
const Wallet = require("../models/Wallet");
const Ledger = require("../models/Ledger");
const Deposit = require("../models/Deposit");
const Withdrawal = require('../models/Withdrawal');


// Deposit

exports.createDeposit = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { amount, assetType, referenceId } = req.body;
    const userId = req.user.userId;

    if (!amount || !assetType) {
      return res.status(400).json({ message: "Amount and assetType required" });
    }

    //  Get or create wallet
    let wallet = await Wallet.findOne({ user: userId }).session(session);
    if (!wallet) {
      wallet = await Wallet.create([{ user: userId, balances: {} }], { session });
    }

    const prevBalance = wallet.balances[assetType] || 0;
    const newBalance = prevBalance + amount;

    //  Update wallet atomically
    wallet.balances[assetType] = newBalance;
    await wallet.save({ session });

    // Create ledger entry
    await Ledger.create([{
      user: userId,
      assetType,
      transactionType: "Deposit",
      amount,
      balanceBefore: prevBalance,
      balanceAfter: newBalance,
      referenceId: referenceId || null,
      status: "Approved",
    }], { session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: "Deposit successful", balance: newBalance });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: err.message });
  }
};


// Withdrawal

exports.createWithdrawal = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { amount, assetType, referenceId } = req.body;
    const userId = req.user.userId;

    if (!amount || !assetType) {
      return res.status(400).json({ message: "Amount and assetType required" });
    }

    let wallet = await Wallet.findOne({ user: userId }).session(session);
    if (!wallet) {
      return res.status(400).json({ message: "Wallet not found" });
    }

    const prevBalance = wallet.balances[assetType] || 0;

    //  Validate sufficient balance
    if (amount > prevBalance) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const newBalance = prevBalance - amount;

    // Update wallet atomically
    wallet.balances[assetType] = newBalance;
    await wallet.save({ session });

    //  Create ledger entry
    await Ledger.create([{
      user: userId,
      assetType,
      transactionType: "Withdrawal",
      amount,
      balanceBefore: prevBalance,
      balanceAfter: newBalance,
      referenceId: referenceId || null,
      status: "Approved",
    }], { session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: "Withdrawal successful", balance: newBalance });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: err.message });
  }
};