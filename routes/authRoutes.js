const express = require("express");
const router = express.Router();
const { registerUser, loginUser, refreshToken } = require("../controllers/authController");

const { body } = require("express-validator");


// REGISTER VALIDATION
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
  ],
  registerUser
);


// LOGIN VALIDATION
router.post(
  "/login",
  [
    body("email").isEmail(),
    body("password").notEmpty()
  ],
  loginUser
);


// REFRESH TOKEN
router.post("/refresh", refreshToken);

module.exports = router;