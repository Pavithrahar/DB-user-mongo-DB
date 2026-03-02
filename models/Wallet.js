const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assets: [
    {
      assetType: { type: String, required: true },
      availableBalance: { type: Number, default: 0 },
      lockedBalance: { type: Number, default: 0 },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("Wallet", walletSchema);