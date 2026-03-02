const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    action: String,
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);