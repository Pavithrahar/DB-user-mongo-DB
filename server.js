// Load Environment Variables

const dotenv = require("dotenv");
dotenv.config(); // Must be at the top

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");


// Initialize App

const app = express();


// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files (deposit proofs)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Routes

app.use("/api/auth", require("./routes/authRoutes"));             // Auth routes
app.use("/api/deposits", require("./routes/depositRoutes"));      // Deposit routes
app.use("/api/withdrawals", require("./routes/withdrawRoutes"));  // Withdrawal routes
app.use("/api/wallets", require("./routes/walletRoutes"));        // Wallet routes
app.use("/api/transactions", require("./routes/transactionRoutes"));// Transactions routes
app.use("/api/fees", require("./routes/feeRoutes"));// Fee & GST routes


// MongoDB Connection

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI); // No options needed for Mongoose 7+
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB Connection Error: ${err.message}`);
    process.exit(1);
  }
};

connectDB();


// Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});


// Global error handler

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message });
});


// Start Server

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));