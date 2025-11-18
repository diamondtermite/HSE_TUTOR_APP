import React from "react";

export default function Nav({ currentPage, setCurrentPage }) {
  const navButton = (id, label) => (
    <button
      type="button"
      onClick={() => setCurrentPage(id)}
      className={currentPage === id ? "nav-btn active" : "nav-btn"}
    >
      {label}
    </button>
  );

  return (
    <nav className="nav-bar">
      {navButton("home", "Home")}
      {navButton("search", "Search")}
      {navButton("requests", "Requests")}
      {navButton("settings", "Settings")}
    </nav>
  );
}