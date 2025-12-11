import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Nav() {
  const { user, logout } = useAuth();
  const auth = user ? user.auth : null;
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  }

  return (
    <nav className="nav-bar">
      <Link to="/">home</Link>
      { user ?
        (
          <>
            {auth === "Teacher" && <Link to="/search">search</Link>}
            {auth !== "Student" && <Link to="/requests">requests</Link>}
            <Link to="/addrequest">add request</Link>
            <button onClick={handleLogout}>logout</button>
          </>
        )
        :
        (
          <>
            <Link to="/login">login</Link>
          </>
        )
      }
      <Link to="/settings">settings</Link>
    </nav>
  );
}