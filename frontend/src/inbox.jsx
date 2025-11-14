import { useState, useEffect } from "react";
function Inbox() {
    const [shown, setShown]=useState(true);
    if (!shown) {
        return null;
    }
    return (

        <div className="inbox-div" >

            <h1>This is the messages div</h1>
            

        </div>

    );

}

export default Inbox;