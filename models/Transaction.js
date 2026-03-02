const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    assetType: {
      type: String,
      required: true,
      uppercase: true
    },
    type: {
      type: String,
      enum: ["DEPOSIT", "WITHDRAWAL"],
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    fee: {
      type: Number,
      default: 0
    },
    gst: {
      type: Number,
      default: 0
    },
    finalAmount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
      index: true
    },
    transactionReferenceId: {
      type: String,
      unique: true,
      sparse: true
    },
    network: String,
    walletAddress: String,
    remarks: String,
    adminRemarks: String,
    proofUrl: String,
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    approvedAt: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);