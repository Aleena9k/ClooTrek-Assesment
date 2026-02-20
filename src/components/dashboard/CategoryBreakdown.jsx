import { useEffect, useState } from "react";
import api from "../../api";
import "./CategoryBreakdown.css";

function CategoryBreakdown() {
  const [data, setData] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await api.get("/tickets/stats/");
      setData(res.data);
    } catch (err) {
      console.error("Failed to load category stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (!data) return null;

  const total = data.total_tickets;

  const categories = [
    { label: "Technical", value: data.category_breakdown.technical, color: "blue" },
    { label: "Billing", value: data.category_breakdown.billing, color: "yellow" },
    { label: "Account", value: data.category_breakdown.account, color: "purple" },
    { label: "General", value: data.category_breakdown.general, color: "green" },
  ];

  return (
    <div className="dashboard-card category-card">
      <div className="card-header">
        <h3>Category Breakdown</h3>
        <span className="more">⋯</span>
      </div>

      <div className="category-body">
        <div className="donut-wrapper">
          <div className="donut-chart">
            <div className="donut-center">
              <h2>{total}</h2>
              <p>TOTAL</p>
            </div>
          </div>
        </div>

        <div className="legend">
          {categories.map((item, idx) => (
            <div key={idx} className="legend-item">
              <span className={`dot ${item.color}`}></span>
              <span>{item.label}</span>
              <b>{((item.value / total) * 100).toFixed(1)}%</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryBreakdown;
