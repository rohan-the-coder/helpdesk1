import React from "react";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">User Dashboard</h1>
      <p className="text-gray-400">Welcome! Here you can view and create support tickets.</p>
      <div className="flex gap-4">
        <Link to="/tickets" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">View Tickets</Link>
        <Link to="/tickets/create" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">Create Ticket</Link>
      </div>
    </div>
  );
};

export default UserDashboard;
