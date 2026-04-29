import { Outlet, useLocation } from "react-router-dom"; // Import Outlet to render child routes
import { useEffect } from "react";
import Nav from "./nav.jsx"; // Import Nav component
import { useAuth } from "./AuthContext.jsx";

/*
The main layout component that acts as a wrapper for all pages in App.jsx, allows for consistent UI as all routes/pages use this layout
Outlet is used to render the child routes within this layout in the context of React Router
*/
function Layout() {
    const { successMessage, setSuccessMessage } = useAuth();
    const location = useLocation();

    useEffect(() => {
        setSuccessMessage("");
    }, [location.pathname, setSuccessMessage]);

    return (
        <div className="wrap-div">
            <Nav />
            {successMessage && <div className="success-message">{successMessage}</div>}
            <Outlet />
        </div>
    );
}

export default Layout; // Export the Layout component