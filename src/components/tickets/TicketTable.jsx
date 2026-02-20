import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./TicketTable.css";

const STATUS_FLOW = ["open", "in_progress", "resolved"];

function TicketTable() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    priority: "",
    status: "",
  });

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tickets, filters, searchQuery]);

  const fetchTickets = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/tickets/");
      const data = await res.json();

      const sorted = data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setTickets(sorted);
    } catch (err) {
      console.error("Error fetching tickets:", err);
    }
  };

  const applyFilters = () => {
    let result = [...tickets];

    if (filters.category) {
      result = result.filter((t) => t.category === filters.category);
    }

    if (filters.priority) {
      result = result.filter((t) => t.priority === filters.priority);
    }

    if (filters.status) {
      result = result.filter((t) => t.status === filters.status);
    }

    if (searchQuery) {
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTickets(result);
  };

  const truncate = (text, limit = 60) => {
    if (!text) return "";
    return text.length > limit ? text.slice(0, limit) + "..." : text;
  };

  const nextStatus = (current) => {
    const index = STATUS_FLOW.indexOf(current);
    return STATUS_FLOW[(index + 1) % STATUS_FLOW.length];
  };

  const changeStatus = async (ticket) => {
    const newStatus = nextStatus(ticket.status);

    try {
      await fetch(`http://localhost:8000/api/tickets/${ticket.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      fetchTickets();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  return (
    <div className="ticket-table-page">
      <div className="table-header">
        <h2>All Tickets</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filters">
          <select
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
          >
            <option value="">All Categories</option>
            <option value="bug">Bug</option>
            <option value="feature">Feature</option>
            <option value="billing">Billing</option>
            <option value="technical">Technical</option>
          </select>

          <select
            onChange={(e) =>
              setFilters({ ...filters, priority: e.target.value })
            }
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>

          <select
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value })
            }
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      <table className="ticket-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {filteredTickets.map((ticket) => (
            <tr
              key={ticket.id}
              className="ticket-row"
              onClick={() => changeStatus(ticket)}
              title="Click to change status"
            >
              <td>{ticket.title}</td>
              <td>{truncate(ticket.description)}</td>
              <td>{ticket.category}</td>
              <td>
                <span className={`priority ${ticket.priority}`}>
                  {ticket.priority}
                </span>
              </td>
              <td>
                <span className={`status ${ticket.status}`}>
                  {ticket.status.replace("_", " ")}
                </span>
              </td>
              <td>{new Date(ticket.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TicketTable;
