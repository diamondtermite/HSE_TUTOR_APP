import { useState, useEffect } from "react";
import Request from './requestContainer.jsx'
function requestsContainer() {

    return (
        <div>
        <h1 className = 'requestHeader'>Requests:</h1>
        <Request />
        </div>
    );
}

export default requestsContainer;

