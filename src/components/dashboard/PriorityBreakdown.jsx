import { useEffect, useState } from "react";
import api from "../../api";
import "./PriorityBreakdown.css";

function PriorityBreakdown() {
  const [data, setData] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await api.get("/tickets/stats/");
      setData(res.data);
    } catch (err) {
      console.error("Failed to load priority stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (!data) return null;

  const priorities = [
    { label: "Low", value: data.priority_breakdown.low, color: "green" },
    { label: "Medium", value: data.priority_breakdown.medium, color: "blue" },
    { label: "High", value: data.priority_breakdown.high, color: "orange" },
    { label: "Critical", value: data.priority_breakdown.critical, color: "red" },
  ];

  const total = priorities.reduce((sum, p) => sum + p.value, 0);

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <h3>Priority Breakdown</h3>
        <span className="more">⋯</span>
      </div>

      <div className="priority-body">
        {priorities.map((item, index) => (
          <div key={index} className="priority-row">
            <div className="priority-top">
              <span>{item.label}</span>
              <b>{item.value}</b>
            </div>

            <div className="priority-bar">
              <div
                className={`priority-fill ${item.color}`}
                style={{ width: `${(item.value / total) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PriorityBreakdown;
