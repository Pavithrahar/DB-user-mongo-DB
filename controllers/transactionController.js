const Deposit = require("../models/Deposit");
const Withdrawal = require("../models/Withdrawal");


// Get all transactions for logged-in user with pagination

const getAllTransactions = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const deposits = await Deposit.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const withdrawals = await Withdrawal.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalDeposits = await Deposit.countDocuments({ userId: req.user._id });
    const totalWithdrawals = await Withdrawal.countDocuments({ userId: req.user._id });

    res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil((totalDeposits + totalWithdrawals) / limit),
      data: {
        deposits,
        withdrawals
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Get single transaction

const getSingleTransaction = async (req, res) => {
  try {

    const { type, id } = req.params;

    let transaction;

    if (type === "deposit") {
      transaction = await Deposit.findById(id);
    } else if (type === "withdrawal") {
      transaction = await Withdrawal.findById(id);
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction type"
      });
    }

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
      });
    }

    res.status(200).json({
      success: true,
      data: transaction
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllTransactions,
  getSingleTransaction
};