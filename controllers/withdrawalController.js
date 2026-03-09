const Withdrawal = require("../models/Withdrawal");
const User = require("../models/User");
const Notification = require("../models/Notification");


// Create withdrawal request
exports.createWithdrawal = async (req, res) => {
  try {

    const { amount } = req.body;

    const user = await User.findById(req.user.id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (user.walletBalance < amount)
      return res.status(400).json({ message: "Insufficient balance" });

    const withdrawal = await Withdrawal.create({
      user: user._id,
      amount
    });

    // Create notification
    await Notification.create({
      user: user._id,
      message: `Withdrawal request of ${amount} created`
    });

    res.status(201).json({
      success: true,
      withdrawal
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// User withdrawals
exports.getUserWithdrawals = async (req, res) => {
  try {

    const withdrawals = await Withdrawal.find({
      user: req.user.id
    });

    res.json({
      success: true,
      withdrawals
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Admin view all withdrawals
exports.getAllWithdrawals = async (req, res) => {
  try {

    const withdrawals = await Withdrawal.find()
      .populate("user", "name email");

    res.json({
      success: true,
      withdrawals
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Approve withdrawal (Concurrency-safe)
exports.approveWithdrawal = async (req, res) => {
  try {

    const withdrawalId = req.params.id;

    const withdrawal = await Withdrawal.findOneAndUpdate(
      { _id: withdrawalId, status: "pending" },
      { $set: { status: "approved" } },
      { new: true }
    );

    if (!withdrawal) {
      return res.status(400).json({
        success: false,
        message: "Already processed"
      });
    }

    const user = await User.findById(withdrawal.user);

    user.walletBalance -= withdrawal.amount;
    await user.save();

    // Create notification
    await Notification.create({
      user: withdrawal.user,
      message: `Your withdrawal of ${withdrawal.amount} has been approved`
    });

    res.json({
      success: true,
      message: "Withdrawal approved"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Reject withdrawal (Concurrency-safe)
exports.rejectWithdrawal = async (req, res) => {
  try {

    const withdrawal = await Withdrawal.findOneAndUpdate(
      { _id: req.params.id, status: "pending" },
      { $set: { status: "rejected" } },
      { new: true }
    );

    if (!withdrawal) {
      return res.status(400).json({
        success: false,
        message: "Already processed"
      });
    }

    // Create notification
    await Notification.create({
      user: withdrawal.user,
      message: `Your withdrawal of ${withdrawal.amount} has been rejected`
    });

    res.json({
      success: true,
      message: "Withdrawal rejected"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};