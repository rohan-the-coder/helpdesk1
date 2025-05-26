import React, { useState } from "react";
import ticketService from "../../services/ticketService";
import { useNavigate } from "react-router-dom";

const TicketCreate = () => {
  const [form, setForm] = useState({ title: "", description: "", category: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ticketService.createTicket(form);
      navigate("/tickets");
    } catch (err) {
      console.error("Ticket creation failed", err);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Create New Ticket</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full bg-[#1F1F1F] p-3 rounded text-white"
          name="title"
          placeholder="Issue Title"
          onChange={handleChange}
          required
        />
        <textarea
          className="w-full bg-[#1F1F1F] p-3 rounded text-white"
          name="description"
          placeholder="Describe your issue"
          onChange={handleChange}
          required
        />
        <select
          name="category"
          onChange={handleChange}
          className="w-full bg-[#1F1F1F] p-3 rounded text-white"
          required
        >
          <option value="">Select Category</option>
          <option value="Software">Software</option>
          <option value="Hardware">Hardware</option>
          <option value="Network">Network</option>
        </select>
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded"
        >
          Submit Ticket
        </button>
      </form>
    </div>
  );
};

export default TicketCreate;
