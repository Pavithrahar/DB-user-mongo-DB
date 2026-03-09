const Ledger = require("../models/Ledger");


// Get Ledger by Logged-in User
const getUserLedger = async (req, res) => {
  try {

    const ledgerEntries = await Ledger.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: ledgerEntries
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


// Admin: Get all ledger transactions
const getAllLedger = async (req, res) => {
  try {

    const ledgerEntries = await Ledger.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: ledgerEntries
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


module.exports = {
  getUserLedger,
  getAllLedger
};
