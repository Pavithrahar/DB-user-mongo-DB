const Deposit = require("../models/Deposit");
const User = require("../models/User");

// Get All Deposits
exports.getAllDeposits = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.user) filter.user = req.query.user;

    const deposits = await Deposit.find(filter)
      .populate("user", "username email")
      .sort(req.query.sort || "-createdAt")
      .skip(skip)
      .limit(limit);

    res.json(deposits);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Approve Deposit
exports.approveDeposit = async (req, res) => {
  try {
    const deposit = await Deposit.findById(req.params.id);
    if (!deposit) return res.status(404).json({ message: "Deposit not found" });
    if (deposit.status !== "pending") return res.status(400).json({ message: "Deposit already processed" });

    deposit.status = "approved";
    deposit.approvedAt = new Date();
    await deposit.save();

    await User.findByIdAndUpdate(deposit.user, { $inc: { walletBalance: deposit.amount } });

    res.json({ message: "Deposit approved", deposit });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Reject Deposit
exports.rejectDeposit = async (req, res) => {
  try {
    const deposit = await Deposit.findById(req.params.id);
    if (!deposit) return res.status(404).json({ message: "Deposit not found" });
    if (deposit.status !== "pending") return res.status(400).json({ message: "Deposit already processed" });

    deposit.status = "rejected";
    await deposit.save();

    res.json({ message: "Deposit rejected", deposit });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};