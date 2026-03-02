const mongoose = require("mongoose");

const withdrawalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assetType: { type: String, required: true },
  amount: { type: Number, required: true },
  destinationWallet: { type: String, required: true },
  remarks: { type: String },
  status: { type: String, enum: ["PENDING","APPROVED","REJECTED"], default: "PENDING" },
  adminRemarks: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Withdrawal", withdrawalSchema);