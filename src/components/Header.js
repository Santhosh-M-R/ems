import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

function Header(props) {
  const [activeTab, setActiveTab] = useState("Home");
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/ems/") {
      setActiveTab("Home");
    } else if (location.pathname === "/ems/add") {
      setActiveTab("AddExpense");
    } else if (location.pathname === "/ems/chart") {
      setActiveTab("Chart");
    }
  }, [location]);

  return (
    <div className="header">
      <p className="logo">Expense Management System</p>
      <div className="header-right">
        <Link to="/ems/">
          <p
            className={`${activeTab === "Home" ? "active" : ""} `}
            onClick={() => setActiveTab("Home")}
          >
            Home
          </p>
        </Link>
        <Link to="/ems/add">
          <p
            className={`${activeTab === "AddExpense" ? "active" : ""} `}
            onClick={() => setActiveTab("AddExpense")}
          >
            Add Expense
          </p>
        </Link>
        <Link to="/ems/chart">
          <p
            className={`${activeTab === "Chart" ? "active" : ""} `}
            onClick={() => setActiveTab("Chart")}
          >
            Chart
          </p>
        </Link>
      </div>
    </div>
  );
}

export default Header;
