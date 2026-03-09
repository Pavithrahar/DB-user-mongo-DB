// seedTransactions.js
require("dotenv").config();
const mongoose = require("mongoose");
const Wallet = require("./models/Wallet");
const Transaction = require("./models/Transaction");
const User = require("./models/User");

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected for seeding transactions"))
  .catch((err) => console.error(err));

const seedTransactions = async () => {
  try {
    // Fetch all users
    const users = await User.find({ isAdmin: false });
    if (!users.length) {
      console.log("No users found. Seed users first.");
      return;
    }

    const assets = ["USD", "BTC", "ETH"];

    const transactions = [];

    for (let user of users) {
      const wallet = await Wallet.findOne({ user: user._id });
      if (!wallet) continue;

      for (let i = 0; i < 5; i++) {
        const asset = assets[Math.floor(Math.random() * assets.length)];
        const amount = Math.floor(Math.random() * 1000) + 1;
        const type = ["Deposit", "Withdrawal", "Fee", "GST"][Math.floor(Math.random() * 4)];
        const balanceBefore = wallet.balances[asset] || 0;
        const balanceAfter =
          type === "Deposit" || type === "Fee" || type === "GST"
            ? balanceBefore + amount
            : balanceBefore - amount;

        // Create transaction object
        transactions.push({
          user: user._id,
          assetType: asset,
          transactionType: type,
          amount,
          balanceBefore,
          balanceAfter,
          referenceId: `REF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          status: "approved",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        // Update wallet balances
        wallet.balances[asset] = balanceAfter;
      }

      await wallet.save();
    }

    await Transaction.insertMany(transactions);

    console.log("Transactions seeded successfully!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedTransactions();