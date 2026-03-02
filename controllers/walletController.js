const Wallet = require("../models/Wallet");

// Get all assets of logged-in user
const getUserWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      return res.status(404).json({ success: false, message: "Wallet not found" });
    }
    res.json({ success: true, data: wallet });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getUserWallet };