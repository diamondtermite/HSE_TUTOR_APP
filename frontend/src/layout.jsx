import { Outlet } from "react-router-dom"; // Import Outlet to render child routes
import Nav from "./nav.jsx"; // Import Nav component

/*
The main layout component that acts as a wrapper for all pages in App.jsx, allows for consistent UI as all routes/pages use this layout
Outlet is used to render the child routes within this layout in the context of React Router
*/
function Layout() {
    return (
        <div className="wrap-div">
            <Nav />
            <Outlet />
        </div>
    );
}

export default Layout; // Export the Layout component