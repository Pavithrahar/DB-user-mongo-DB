const Deposit = require("../models/Deposit");
const Withdrawal = require("../models/Withdrawal");


// Get all transactions for logged-in user

const getAllTransactions = async (req, res) => {
  try {
    const deposits = await Deposit.find({ userId: req.user._id }).sort({ createdAt: -1 });
    const withdrawals = await Withdrawal.find({ userId: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        deposits,
        withdrawals,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single transaction (deposit or withdrawal)

const getSingleTransaction = async (req, res) => {
  try {
    const { type, id } = req.params;
    let transaction;

    if (type === "deposit") {
      transaction = await Deposit.findById(id);
    } else if (type === "withdrawal") {
      transaction = await Withdrawal.findById(id);
    } else {
      return res.status(400).json({ success: false, message: "Invalid transaction type" });
    }

    if (!transaction)
      return res.status(404).json({ success: false, message: "Transaction not found" });

    res.status(200).json({ success: true, data: transaction });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllTransactions, getSingleTransaction };