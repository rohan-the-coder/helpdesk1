const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { createCategory, getCategories } = require("../controllers/categoryController");

const router = express.Router();

// ✅ Only Admins can create categories
router.post("/", authMiddleware, roleMiddleware("Admin"), createCategory);

// ✅ All authenticated users can view categories
router.get("/", authMiddleware, getCategories);

module.exports = router;
