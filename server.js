require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

//database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB Connected"))
  .catch((err) => console.log(" DB Error:", err));

// middleware 
app.use(cors());
app.use(express.json());

//Routes
const authRoutes = require("./routes/authRoutes");
const userDataRoutes = require("./routes/userDataRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/data", userDataRoutes);

//Test Route
app.get("/", (req, res) => {
  res.send(" API is running...");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
