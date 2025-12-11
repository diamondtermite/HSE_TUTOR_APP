import { useState, useEffect } from "react";
import Request from './request.jsx'
function RequestContainer() {
    const [requests, setRequests] = useState([]);
    useEffect(() => {
        fetch('/api/requests')
            .then(response => response.json())
            .then(data => setRequests(data))
            .catch(error => console.error('Error fetching requests:', error));
    }, []);

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

