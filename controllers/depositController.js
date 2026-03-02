const Deposit = require("../models/Deposit");
const Wallet = require("../models/Wallet");
const FeeConfig = require("../models/FeeConfig");


// Create Deposit (User)

const createDeposit = async (req, res) => {
  try {
    const { assetType, amount, network, walletAddress, remarks } = req.body;

    const depositData = {
      userId: req.user._id,
      assetType,
      amount,
      network,
      walletAddress,
      remarks,
      status: "PENDING",
      transactionReferenceId: "DEP" + Date.now(),
      assetProof: req.file ? req.file.path : null,
    };

    const deposit = await Deposit.create(depositData);

    res.status(201).json({
      success: true,
      message: "Deposit created successfully",
      data: deposit,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Get All Deposits (User)

const getAllDeposits = async (req, res) => {
  try {
    const deposits = await Deposit.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: deposits });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Admin: Approve/Reject Deposit

const updateDepositStatus = async (req, res) => {
  try {
    const { status, adminRemarks } = req.body;
    const deposit = await Deposit.findById(req.params.id);
    if (!deposit) return res.status(404).json({ success: false, message: "Deposit not found" });

    deposit.status = status;
    deposit.adminRemarks = adminRemarks || "";
    await deposit.save();

    // Only process wallet if approved
    if (status === "APPROVED") {
      // Get fee config
      const feeConfig = await FeeConfig.findOne({ assetType: deposit.assetType });
      let fee = 0, gst = 0, finalAmount = deposit.amount;

      if (feeConfig && feeConfig.feesEnabled) {
        fee = deposit.amount * feeConfig.feePercent / 100;
        gst = fee * feeConfig.gstPercent / 100;
        finalAmount = deposit.amount - fee - gst;
      }

      let wallet = await Wallet.findOne({ userId: deposit.userId });
      if (!wallet) {
        wallet = await Wallet.create({
          userId: deposit.userId,
          assets: [{
            assetType: deposit.assetType,
            availableBalance: finalAmount,
            lockedBalance: 0
          }]
        });
      } else {
        if (!wallet.assets) wallet.assets = [];
        let asset = wallet.assets.find(a => a.assetType === deposit.assetType);
        if (asset) asset.availableBalance += finalAmount;
        else wallet.assets.push({ assetType: deposit.assetType, availableBalance: finalAmount, lockedBalance: 0 });
        await wallet.save();
      }
    }

    res.json({ success: true, message: `Deposit ${status.toLowerCase()} successfully`, data: deposit });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createDeposit, getAllDeposits, updateDepositStatus };