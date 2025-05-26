const Ticket = require("../models/Ticket");
const mongoose = require("mongoose");

exports.createTicket = async (req, res) => {
  try {
    const ticketData = {
      ...req.body,
      createdBy: req.user.userId,
      status: "Open"
    };

    const ticket = new Ticket(ticketData);
    await ticket.save();

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate("createdBy", "name email")
      .populate("category", "name");

    res.status(201).json(populatedTicket);
  } catch (err) {
    console.error("Error creating ticket:", err);
    res.status(500).json({ 
      message: "Failed to create ticket",
      error: err.message 
    });
  }
};

exports.getTickets = async (req, res) => {
  try {
    // Users can only see their own tickets
    const tickets = await Ticket.find({ createdBy: req.user.userId })
      .populate("createdBy", "name email")
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (err) {
    console.error("Error fetching tickets:", err);
    res.status(500).json({ 
      message: "Error fetching tickets",
      error: err.message 
    });
  }
};

exports.getTicketById = async (req, res) => {
  try {
    console.log('Fetching ticket with ID:', req.params.id);
    console.log('User ID from token:', req.user.userId);

    const ticket = await Ticket.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("category", "name")
      .populate("comments.author", "name email");

    console.log('Found ticket:', ticket);

    if (!ticket) {
      console.log('Ticket not found');
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Handle case where createdBy is null
    if (!ticket.createdBy) {
      console.log('Ticket has no creator, allowing access');
      return res.json(ticket);
    }

    // Check if the user is authorized to view this ticket
    if (ticket.createdBy._id.toString() !== req.user.userId) {
      console.log('Authorization failed. Ticket createdBy:', ticket.createdBy._id.toString(), 'User:', req.user.userId);
      return res.status(403).json({ message: "Not authorized to view this ticket" });
    }

    res.json(ticket);
  } catch (err) {
    console.error("Error fetching ticket:", err);
    console.error("Stack trace:", err.stack);
    res.status(500).json({ 
      message: "Error fetching ticket",
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Check if the user is authorized to update this ticket
    if (ticket.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized to update this ticket" });
    }

    // Only allow updating certain fields
    const allowedUpdates = ["status"];
    const updates = Object.keys(req.body)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    )
      .populate("createdBy", "name email")
      .populate("category", "name")
      .populate("comments.author", "name email");

    res.json(updatedTicket);
  } catch (err) {
    console.error("Error updating ticket:", err);
    res.status(500).json({ 
      message: "Failed to update ticket",
      error: err.message 
    });
  }
};

exports.addComment = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Check if the user is authorized to comment on this ticket
    if (ticket.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized to comment on this ticket" });
    }

    const comment = {
      text: req.body.text,
      author: req.user.userId
    };

    ticket.comments.push(comment);
    await ticket.save();

    const updatedTicket = await Ticket.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("category", "name")
      .populate("comments.author", "name email");

    res.json(updatedTicket);
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ 
      message: "Failed to add comment",
      error: err.message 
    });
  }
};

exports.getTicketStats = async (req, res) => {
  try {
    console.log('Fetching stats for user:', req.user.userId);
    
    const stats = await Ticket.aggregate([
      { 
        $match: { 
          createdBy: new mongoose.Types.ObjectId(req.user.userId)
        } 
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          open: {
            $sum: { $cond: [{ $eq: ["$status", "Open"] }, 1, 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0] }
          },
          resolved: {
            $sum: { $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0] }
          }
        }
      }
    ]);

    console.log('Found stats:', stats);

    const defaultStats = {
      total: 0,
      open: 0,
      inProgress: 0,
      resolved: 0
    };

    res.json(stats.length > 0 ? stats[0] : defaultStats);
  } catch (err) {
    console.error("Error fetching ticket stats:", err);
    console.error("Stack trace:", err.stack);
    res.status(500).json({ 
      message: "Error fetching ticket statistics",
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

exports.getRecentTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ createdBy: req.user.userId })
      .populate("createdBy", "name email")
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(tickets);
  } catch (err) {
    console.error("Error fetching recent tickets:", err);
    res.status(500).json({ 
      message: "Error fetching recent tickets",
      error: err.message 
    });
  }
};
