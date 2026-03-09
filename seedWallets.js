// seedWallets.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Wallet = require("./models/Wallet");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");

    // Example wallets to seed
    const wallets = [
      {
        user: "64f0a1b2c3d4e5f67890abce", // Replace with real user ObjectId
        balances: {
          BTC: 1.2,
          ETH: 5,
          USDT: 1000
        }
      },
      {
        user: "64f0a1b2c3d4e5f67890abcf", // Replace with another user
        balances: {
          BTC: 0.5,
          ETH: 2.5,
          USDT: 500
        }
      }
    ];

    // Clear existing wallets (optional)
    await Wallet.deleteMany({});
    console.log("Old wallets cleared");

    // Insert new wallets
    await Wallet.insertMany(wallets);
    console.log("Wallets seeded successfully");

    process.exit();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });