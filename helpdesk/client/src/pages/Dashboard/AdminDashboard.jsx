import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
      <p className="text-gray-400">Overview of all system activity, users, and agents.</p>
      <div className="flex gap-4 flex-wrap">
        <Link to="/admin/tickets" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">All Tickets</Link>
        <Link to="/admin/users" className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded">Manage Users</Link>
        <Link to="/admin/agents" className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded">Manage Agents</Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
