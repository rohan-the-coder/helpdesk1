const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const {
  createTicket,
  getTickets,
  updateTicket,
} = require("../controllers/ticketController");

// Create a new ticket (any logged-in user)
router.post("/", authMiddleware, createTicket);

// Get tickets
// Agents and Admins can see all tickets, users only their own
router.get("/", authMiddleware, getTickets);

// Update ticket by id
// Agents and Admins only
router.put("/:id", authMiddleware, roleMiddleware(["Agent", "Admin"]), updateTicket);

module.exports = router;
