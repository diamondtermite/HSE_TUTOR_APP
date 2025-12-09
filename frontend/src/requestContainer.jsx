import { useState, useEffect } from "react";
import Request from './request.jsx'
function RequestContainer() {

    return (
        <div className="requestContainer">
            <h1 className = 'requestHeader'>Requests:</h1>
            <div className="requestsDiv">
                <Request studentName="John John" studentGrade="11" class="English" info="My name is John and I need help with my Math"/>
            </div>
        </div>
    );
}

export default RequestContainer;

