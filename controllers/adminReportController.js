const Deposit = require("../models/Deposit");
const Withdrawal = require("../models/Withdrawal");


// TOTAL DEPOSITS
exports.getTotalDeposits = async (req, res) => {
  try {

    const { startDate, endDate, page = 1, limit = 10 } = req.query;

    const filter = {};

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const skip = (page - 1) * limit;

    const deposits = await Deposit.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const totalAmount = await Deposit.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);

    res.json({
      success: true,
      totalDeposits: totalAmount[0]?.total || 0,
      page: parseInt(page),
      limit: parseInt(limit),
      data: deposits
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// TOTAL WITHDRAWALS
exports.getTotalWithdrawals = async (req, res) => {
  try {

    const { startDate, endDate, page = 1, limit = 10 } = req.query;

    const filter = {};

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const skip = (page - 1) * limit;

    const withdrawals = await Withdrawal.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const totalAmount = await Withdrawal.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);

    res.json({
      success: true,
      totalWithdrawals: totalAmount[0]?.total || 0,
      page: parseInt(page),
      limit: parseInt(limit),
      data: withdrawals
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// TOTAL ASSETS HELD IN PLATFORM
exports.getTotalAssets = async (req, res) => {
  try {

    const deposits = await Deposit.aggregate([
      { $match: { status: "APPROVED" } },
      {
        $group: {
          _id: null,
          totalDeposits: { $sum: "$amount" }
        }
      }
    ]);

    const withdrawals = await Withdrawal.aggregate([
      { $match: { status: "APPROVED" } },
      {
        $group: {
          _id: null,
          totalWithdrawals: { $sum: "$amount" }
        }
      }
    ]);

    const totalDeposits = deposits[0]?.totalDeposits || 0;
    const totalWithdrawals = withdrawals[0]?.totalWithdrawals || 0;

    const totalAssets = totalDeposits - totalWithdrawals;

    res.json({
      success: true,
      totalDeposits,
      totalWithdrawals,
      totalAssets
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};