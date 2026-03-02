console.log("JWT_SECRET =", process.env.JWT_SECRET);
console.log("JWT_REFRESH_SECRET =", process.env.JWT_REFRESH_SECRET);
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// Generate Access Token

const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
};


// Generate Refresh Token

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};


// Register new user

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "All fields are required" });

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { _id: user._id, name: user.name, email: user.email, accessToken, refreshToken },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Login existing user

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { _id: user._id, name: user.name, email: user.email, accessToken, refreshToken },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Refresh token endpoint

const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, message: "Refresh token required" });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const accessToken = generateAccessToken(decoded.id);

    res.status(200).json({ success: true, accessToken });
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid or expired refresh token" });
  }
};

module.exports = { registerUser, loginUser, refreshToken };