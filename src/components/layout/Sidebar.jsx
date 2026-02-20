import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">🚀</div>
        <span>SupportFlow</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className="nav-item">
          <span className="nav-icon">📊</span>
          Dashboard
        </NavLink>

        <NavLink to="/tickets" className="nav-item">
          <span className="nav-icon">📁</span>
          Tickets
        </NavLink>

        <NavLink to="/submit-ticket" className="nav-item">
          <span className="nav-icon">➕</span>
          Submit Ticket
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;
