const mongoose = require("mongoose");

const feeSettingSchema = new mongoose.Schema(
  {
    assetType: { type: String, required: true, unique: true },
    feePercent: { type: Number, default: 0 },
    gstPercent: { type: Number, default: 0 },
    feeEnabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FeeSetting", feeSettingSchema);