const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  addComment,
  getTicketStats,
  getRecentTickets,
} = require("../controllers/ticketController");

// Get ticket statistics (specific route before dynamic routes)
router.get("/stats", authMiddleware, getTicketStats);

// Get recent tickets (specific route before dynamic routes)
router.get("/recent", authMiddleware, getRecentTickets);

// Create a new ticket (any logged-in user)
router.post("/", authMiddleware, createTicket);

// Get tickets (users only see their own)
router.get("/", authMiddleware, getTickets);

// Get ticket by id (dynamic route after specific routes)
router.get("/:id", authMiddleware, getTicketById);

// Update ticket
router.put("/:id", authMiddleware, updateTicket);

// Add comment to ticket
router.post("/:id/comments", authMiddleware, addComment);

module.exports = router;
