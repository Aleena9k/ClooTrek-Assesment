import StatsCards from "../components/dashboard/StatsCards";
import CategoryBreakdown from "../components/dashboard/CategoryBreakdown";
import PriorityBreakdown from "../components/dashboard/PriorityBreakdown";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div>
      <StatsCards />

      <div className="breakdown-grid">
      <CategoryBreakdown />
      <PriorityBreakdown />
    </div>


    </div>
  );
}

export default Dashboard;
