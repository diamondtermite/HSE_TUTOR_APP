import { useState, useEffect } from "react";
import Request from './request.jsx'
function requestsContainer() {

    return (
        <div className="requestContainer">
            <h1 className = 'requestHeader'>Requests:</h1>
            <div className="requestsDiv">
                <Request requestName="John's Math Homework" info="My name is John and I need help with my Math"/>
            </div>
        </div>
    );
}

export default requestsContainer;

