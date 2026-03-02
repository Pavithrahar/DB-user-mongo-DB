const Deposit = require("../models/Deposit");
const Wallet = require("../models/Wallet");
const FeeSetting = require("../models/FeeSetting");

// ✅ GET all deposits (Admin)
exports.getAllDeposits = async (req, res) => {
  try {
    const deposits = await Deposit.find()
      .sort({ createdAt: -1 });

    res.json({ success: true, data: deposits });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Approve deposit (Admin)
exports.approveDeposit = async (req, res) => {
  try {
    const deposit = await Deposit.findById(req.params.id);

    if (!deposit) {
      return res.status(404).json({
        success: false,
        message: "Deposit not found",
      });
    }

    if (deposit.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Deposit already processed",
      });
    }

    // 🔹 Fee & GST calculation (if exists)
    const feeConfig =
      (await FeeSetting.findOne({ assetType: deposit.assetType })) || {
        feePercent: 0,
        gstPercent: 0,
      };

    const fee = (deposit.amount * feeConfig.feePercent) / 100;
    const gst = (fee * feeConfig.gstPercent) / 100;
    const finalAmount = deposit.amount - fee - gst;

    // 🔹 Update deposit
    deposit.status = "APPROVED";
    deposit.fee = fee;
    deposit.gst = gst;
    deposit.finalAmount = finalAmount;

    await deposit.save();

    // 🔹 Update wallet
    let wallet = await Wallet.findOne({
      userId: deposit.userId,
      assetType: deposit.assetType,
    });

    if (!wallet) {
      wallet = await Wallet.create({
        userId: deposit.userId,
        assetType: deposit.assetType,
        availableBalance: finalAmount,
        lockedBalance: 0,
      });
    } else {
      wallet.availableBalance += finalAmount;
      await wallet.save();
    }

    res.json({
      success: true,
      message: "Deposit approved successfully",
      data: deposit,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Reject deposit (Admin)
exports.rejectDeposit = async (req, res) => {
  try {
    const deposit = await Deposit.findById(req.params.id);

    if (!deposit) {
      return res.status(404).json({
        success: false,
        message: "Deposit not found",
      });
    }

    if (deposit.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Deposit already processed",
      });
    }

    deposit.status = "REJECTED";
    await deposit.save();

    res.json({
      success: true,
      message: "Deposit rejected successfully",
      data: deposit,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};