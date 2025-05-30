import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get("/api/tickets");
        setTickets(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleStatusUpdate = async (ticketId, newStatus) => {
    try {
      const response = await api.put(`/api/tickets/${ticketId}`, {
        status: newStatus,
        comment: comment
      });
      
      // Update the tickets list with the updated ticket
      setTickets(tickets.map(ticket =>
        ticket._id === ticketId ? response.data : ticket
      ));
      
      // Reset form
      setSelectedTicket(null);
      setComment("");
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-yellow-100 text-yellow-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return <div className="text-center">Loading tickets...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
      <p className="text-gray-400">Overview of all system activity, users, and agents.</p>
      
      <div className="flex gap-4 flex-wrap mb-6">
        <Link to="/admin/manage-users" className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded">Manage Users & Agents</Link>
        <Link to="/admin/manage-categories" className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded">Manage Categories</Link>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">All Tickets</h2>
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="bg-gray-700 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold">{ticket.title}</h3>
                  <p className="text-sm text-gray-400">
                    Created by: {ticket.createdBy?.name || 'Unknown'}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(ticket.status)}`}>
                  {ticket.status}
                </span>
              </div>

              <p className="text-gray-300 mb-4">{ticket.description}</p>

              {selectedTicket?._id === ticket._id ? (
                <div className="space-y-4 border-t border-gray-600 pt-4">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment about this status change..."
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusUpdate(ticket._id, "In Progress")}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                      disabled={ticket.status === "In Progress"}
                    >
                      Mark In Progress
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(ticket._id, "Resolved")}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                      disabled={ticket.status === "Resolved"}
                    >
                      Mark Resolved
                    </button>
                    <button
                      onClick={() => setSelectedTicket(null)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedTicket(ticket)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Update Status
                  </button>
                  <Link to={`/tickets/${ticket._id}`} className="text-blue-400 hover:text-blue-300 px-4 py-2 rounded border border-blue-400 hover:border-blue-300">
                    View Details →
                  </Link>
                </div>
              )}

              {ticket.comments && ticket.comments.length > 0 && (
                <div className="mt-4 border-t border-gray-600 pt-4">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Comments</h4>
                  <div className="space-y-2">
                    {ticket.comments.map((comment, index) => (
                      <div key={index} className="text-sm text-gray-300">
                        <span className="text-gray-400">{comment.author?.name}: </span>
                        {comment.text}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {tickets.length === 0 && (
            <div className="text-center py-12 bg-gray-700 rounded-lg">
              <p className="text-gray-400">No tickets available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;