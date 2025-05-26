import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ticketService from "../../services/ticketService";
import Loader from "../../components/Loader";

const TicketDetails = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const data = await ticketService.getTicketById(id);
        setTicket(data);
      } catch (err) {
        console.error("Failed to load ticket", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  if (loading) return <Loader />;

  if (!ticket) return <p className="text-gray-400">Ticket not found.</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{ticket.title}</h2>
      <p className="text-gray-300">{ticket.description}</p>
      <div className="text-sm text-gray-400">
        <p>Category: {ticket.category}</p>
        <p>Status: {ticket.status}</p>
        <p>Created At: {new Date(ticket.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default TicketDetails;
