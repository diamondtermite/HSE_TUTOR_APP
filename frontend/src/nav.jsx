// import React library and necessary hooks/components from react-router-dom
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Nav() {
  const { user, logout } = useAuth(); // get user and logout function from AuthContext
  const auth = user ? user.auth : null; // define the user's auth level if user exists
  const navigate = useNavigate(); 

  const handleLogout = async () => { // function to handle user logout that redirects to home page
    await logout();
    navigate("/");
  }
  /* 
    Render navigation bar with links based on user's authentication status and role
    - Always show 'home' and 'settings' links
    - If user is logged in:
      - Show 'search' link for Teachers
      - Show 'requests' link for Students, Tutors, and Teachers with different query parameters
      - Show 'add request' link for non-Teachers
      - Show 'logout' button
    - If user is not logged in:
      - Show 'login' link
  */
  return (
    <nav className="nav-bar">
      {" | "} <Link to="/"> <h3> home </h3> </Link> {" | "}
      { user ?
        (
          <>
<<<<<<< HEAD
            {auth === "Teacher" && <Link to="/search">search</Link>}
            {auth === "Student" && <Link to="/requests?only_self=true">requests</Link>}
            {auth === "Tutor" && <Link to="/requests?hide_accepted=true&self=false">requests</Link>}
            {auth === "Teacher" && <Link to="/requests">requests</Link>}
            {auth !== "Teacher" && <Link to="/addrequest">add request</Link>}
            <button onClick={handleLogout}>logout</button>
=======
            {auth === "Teacher" && <Link to="/search"> <h3> search </h3> <> | </></Link>}
            {auth !== "Student" && <Link to="/requests"> <h3> requests </h3> </Link>} {" | "}
            <Link to="/addrequest"> <h3> add request </h3> </Link> {" | "}
            <Link to="/settings"> <h3> settings </h3> </Link> {" | "}
            <button onClick={handleLogout}> logout </button> {" | "}
>>>>>>> d02c9c4 (css work with some documentation)
          </>
        )
        :
        (
          <>
            <Link to="/login"> <h3> login </h3> </Link>
          </>
        )
      }
    </nav>
  );
}