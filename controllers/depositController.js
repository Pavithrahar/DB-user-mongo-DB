const Deposit = require("../models/Deposit");
const User = require("../models/User");


//  Create Deposit (User)

exports.createDeposit = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid deposit amount"
      });
    }

    const deposit = await Deposit.create({
      user: req.user._id,
      amount,
      status: "pending"
    });

    res.status(201).json({
      success: true,
      message: "Deposit request created",
      data: deposit
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};


//  User - View Own Deposits

exports.getMyDeposits = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { user: req.user._id };

    if (status) query.status = status;

    const deposits = await Deposit.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      message: "Deposits fetched successfully",
      data: deposits
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};


//  Admin - View All Deposits

exports.getAllDeposits = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, userId } = req.query;

    const query = {};

    if (status) query.status = status;
    if (userId) query.user = userId;

    const deposits = await Deposit.find(query)
      .populate("user", "username email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      message: "All deposits fetched successfully",
      data: deposits
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};


// Admin - Approve Deposit

exports.approveDeposit = async (req, res) => {
  try {
    const deposit = await Deposit.findById(req.params.id);

    if (!deposit) {
      return res.status(404).json({
        success: false,
        message: "Deposit not found"
      });
    }

    if (deposit.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending deposits can be approved"
      });
    }

    deposit.status = "approved";
    await deposit.save();

    await User.findByIdAndUpdate(deposit.user, {
      $inc: { walletBalance: deposit.amount }
    });

    res.status(200).json({
      success: true,
      message: "Deposit approved successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};


//  Admin - Reject Deposit

exports.rejectDeposit = async (req, res) => {
  try {
    const deposit = await Deposit.findById(req.params.id);

    if (!deposit) {
      return res.status(404).json({
        success: false,
        message: "Deposit not found"
      });
    }

    if (deposit.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending deposits can be rejected"
      });
    }

    deposit.status = "rejected";
    await deposit.save();

    res.status(200).json({
      success: true,
      message: "Deposit rejected successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};


//  User - Get Wallet Balance

exports.getWalletBalance = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Wallet balance fetched successfully",
      data: {
        walletBalance: req.user.walletBalance
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};