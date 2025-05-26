import React, { useEffect, useState } from "react";
import ticketService from "../../services/ticketService";
import TicketCard from "../../components/TicketCard";
import Loader from "../../components/Loader";

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await ticketService.getAllTickets();
        setTickets(data);
      } catch (error) {
        console.error("Failed to fetch tickets", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">All Tickets</h2>
      {loading ? (
        <Loader />
      ) : tickets.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tickets.map((ticket) => (
            <TicketCard key={ticket._id} ticket={ticket} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No tickets found.</p>
      )}
    </div>
  );
};

export default TicketList;
