import { Outlet } from "react-router-dom";
import Nav from "./nav.jsx";

function Layout() {
    return (
        <div className="wrap-div">
            <Nav />
            <Outlet />
        </div>
    );
}

export default Layout;