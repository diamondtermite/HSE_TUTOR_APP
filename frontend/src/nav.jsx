import React from "react";
import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <nav className="nav-bar">
      <Link to="/">Home</Link> |{" "}
      <Link to="/search">search</Link> |{" "}
      <Link to="/requests">requests</Link> |{" "}
      <Link to="/settings">settings</Link> |{" "}
    </nav>
  );
}