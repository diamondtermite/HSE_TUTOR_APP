// importing necessary libraries and hooks
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Request from './request.jsx'

function RequestContainer() {
    const location = useLocation(); // get current location to access query parameters, basically gives the part of the URL after the domain
    const fetchURL = '/api/requests' + location.search; // construct fetch URL with query parameters bt appending location.search to base URL. location.search contains the query string part of the URL, starting with '?'
    const [requests, setRequests] = useState([]); // state to hold fetched requests

    useEffect(() => { // effect to fetch requests when component mounts or fetchURL/requests change
        fetch(fetchURL) // fetch requests from the constructed URL
            .then(response => response.json())
            .then(data => setRequests(data))
            .catch(error => console.error('Error fetching requests:', error));
    }, [fetchURL, requests]); // dependencies: fetchURL and requests, so effect runs when either changes

    /* 
    Rendering the RequestContainer component which displays a list of requests.
    It includes a header and maps over the requests state to render individual Request components.
    Each Request component is passed its respective properties/details using the spread operator and has a key set to its request_id.
    */
    return (
        <div className="requestContainer">
            <h1 className = 'requestHeader'>Requests:</h1>

            {/*VVV all requests go here VVV*/}

            <div className="requestsDiv">
                {requests.map((req) => (
                    <Request
                        key={req.request_id}
                        {...req}
                    />
                ))}
            </div>
            
        </div>
    );
}

export default RequestContainer; // exporting the RequestContainer component


