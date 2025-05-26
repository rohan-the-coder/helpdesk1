const Ticket = require("../models/Ticket");
const sendNotification = require("../utils/sendNotification");

exports.createTicket = async (req, res) => {
  try {
    const ticket = new Ticket({ ...req.body, createdBy: req.user.userId });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: "Failed to create ticket" });
  }
};

exports.getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("createdBy", "name")
      .populate("assignedTo", "name")
      .populate("category", "name");
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tickets" });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const { status, comment, assignedTo } = req.body;

    // Update ticket fields if provided
    if (status) ticket.status = status;
    if (assignedTo) ticket.assignedTo = assignedTo;
    if (comment) {
      ticket.comments.push({
        text: comment,
        by: req.user.userId,
      });
    }

    await ticket.save();

    // Send notifications
    if (status) {
      await sendNotification(ticket.createdBy, `Your ticket "${ticket.title}" status updated to "${status}".`);
    }

    if (comment) {
      await sendNotification(ticket.createdBy, `A new comment was added to your ticket "${ticket.title}".`);
    }

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: "Failed to update ticket" });
  }
};
