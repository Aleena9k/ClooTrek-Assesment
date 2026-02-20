import { useEffect, useState } from "react";
import api from "../../api";
import "./StatsCards.css";

function StatsCards() {
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await api.get("/tickets/stats/");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (!stats) return null;

  const cards = [
    {
      title: "Total Tickets",
      value: stats.total_tickets,
      trend: "Overall",
      icon: "📊",
      color: "blue",
    },
    {
      title: "Open Tickets",
      value: stats.open_tickets,
      trend: "Current",
      icon: "📂",
      color: "orange",
    },
    {
      title: "Avg / Day",
      value: stats.avg_tickets_per_day,
      trend: "Daily",
      icon: "📈",
      color: "purple",
    },
    {
      title: "Resolved",
      value:
        stats.total_tickets -
        (stats.open_tickets +
          stats.priority_breakdown.high +
          stats.priority_breakdown.critical),
      trend: "Completed",
      icon: "✅",
      color: "green",
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((item, index) => (
        <div key={index} className={`stat-card ${item.color}`}>
          <div className="stat-top">
            <p className="stat-title">{item.title}</p>
            <span className="stat-icon">{item.icon}</span>
          </div>

          <h2 className="stat-value">{item.value}</h2>
          <p className="stat-trend">{item.trend}</p>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;
