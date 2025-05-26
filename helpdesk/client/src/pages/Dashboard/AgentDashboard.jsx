import React from "react";
import { Link } from "react-router-dom";

const AgentDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Agent Dashboard</h1>
      <p className="text-gray-400">Manage tickets assigned to you and respond to users.</p>
      <Link to="/agent/tickets" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
        Assigned Tickets
      </Link>
    </div>
  );
};

export default AgentDashboard;
