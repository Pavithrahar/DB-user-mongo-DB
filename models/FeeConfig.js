const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema({
  assetType: { type: String, required: true },
  feePercentage: { type: Number, default: 0 },
  gstPercentage: { type: Number, default: 0 },
  isFeeEnabled: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("FeeConfig", feeSchema);