const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    assetType: {
      type: String,
      required: true
    },

    transactionType: {
      type: String,
      enum: ["DEPOSIT", "WITHDRAWAL", "FEE", "GST", "ADJUSTMENT"],
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    balanceBefore: {
      type: Number,
      required: true
    },

    balanceAfter: {
      type: Number,
      required: true
    },

    referenceId: {
      type: mongoose.Schema.Types.ObjectId
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "APPROVED"
    },

    remarks: {
      type: String
    }
  },
  { timestamps: true }
);


//  Prevent Ledger Update (Immutable Protection)
ledgerSchema.pre("findOneAndUpdate", function () {
  throw new Error("Ledger entries are immutable and cannot be updated");
});

ledgerSchema.pre("updateOne", function () {
  throw new Error("Ledger entries are immutable and cannot be updated");
});

ledgerSchema.pre("deleteOne", function () {
  throw new Error("Ledger entries cannot be deleted");
});

ledgerSchema.pre("findOneAndDelete", function () {
  throw new Error("Ledger entries cannot be deleted");
});

module.exports = mongoose.model("Ledger", ledgerSchema);