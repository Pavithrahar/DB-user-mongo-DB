// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const authRoutes = require("./routes/authRoutes");

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use("/api/auth", authRoutes);

// // Test route
// app.get("/", (req, res) => {
//   res.send("Server is running!");
// });

// // Connect to MongoDB (NO old options)
// mongoose.connect("mongodb://localhost:27017/db_user")
//   .then(() => {
//     console.log("MongoDB connected");
//     app.listen(5000, () => {
//       console.log("Server running on port 5000");
//     });
//   })
//   .catch((err) => {
//     console.log("MongoDB connection error:", err);
//   });
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

/* ===========================
   DATABASE CONNECTION
=========================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

/* ===========================
   MIDDLEWARE
=========================== */
app.use(cors());
app.use(express.json());

/* ===========================
   ROUTES
=========================== */
const authRoutes = require("./routes/authRoutes");
const userDataRoutes = require("./routes/userDataRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/data", userDataRoutes);

/* ===========================
   TEST ROUTE
=========================== */
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

/* ===========================
   SERVER START
=========================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
