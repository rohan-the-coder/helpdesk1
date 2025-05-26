import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{ticket.title}</h3>
                  <p className="text-sm text-gray-400">
                    Created by: {ticket.createdBy?.name || 'Unknown'}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded text-sm ${ticket.status === 'Open' ? 'bg-green-500' : ticket.status === 'In Progress' ? 'bg-yellow-500' : 'bg-blue-500'}`}>
                  {ticket.status}
                </span>
              </div>
              <Link to={`/tickets/${ticket._id}`} className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block">
                View Details →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
