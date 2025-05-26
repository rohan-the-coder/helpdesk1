const express = require('express');
const router = express.Router();

// @route POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
