// importing necessary libraries and hooks
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RequestForm() {
    // state variables to hold form input values
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [location, setLocation] = useState("");
    const [classSubject, setClassSubject] = useState("Math");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) { // function to handle form submission, async to wait for server response, takes event object as parameter
        e.preventDefault(); // prevent default form submission behavior, which would reload the page

        const res = await fetch("/api/addrequest", { // await fetch call to route to add a new request
            method: 'POST', // POST method to send data to server
            credentials: "include", // include credentials for authentication
            headers: { "Content-Type": "application/json"}, // setting content type to JSON
            body: JSON.stringify({classSubject, date, startTime, endTime, location}) // sending form data as JSON in the request body
        });

        const data = await res.json(); // await response and parse as JSON
        
        if(data.success) {
            navigate("/"); // navigate to home page on successful request submission
        } else {
            setError(data.message); // set error message from server response if submission fails
        }
    }
    /* 
    requestForm component rendering a form for users to submit tutoring requests.
    The form includes fields for date, start time, end time, location, and class/subject.
    Each input field updates its respective state variable on change.
    On submission, it triggers the handleSubmit function to send the data to the server.
    If there's an error during submission, it displays the error message.
    */
    return(
        <form className="requestForm" onSubmit={handleSubmit}>
            <label htmlFor="date">Date:</label>
            <input type="date" id="date" name="date" required onChange={(e) => setDate(e.target.value)} />

            <label htmlFor="start_time">Start Time:</label>
            <input type="time" id="start_time" name="start_time" required onChange={(e) => setStartTime(e.target.value)} />

            <label htmlFor="end_time">End Time:</label>
            <input type="time" id="end_time" name="end_time" required onChange={(e) => setEndTime(e.target.value)} />

            <label htmlFor="location">Location:</label>
            <input type="text" id="location" name="location" required onChange={(e) => setLocation(e.target.value)} />

            <label htmlFor="classSubject">Class/Subject:</label>
            <select id="classSubject" name="classSubject" required onChange={(e) => setClassSubject(e.target.value)}>
                <option value="Math">Math</option>
                <option value="English">English</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="Foreign Language">Foreign Language</option>
                <option value="Other">Other</option>
            </select>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button type="submit" className="submitRequestBtn">Submit Request</button>
        </form>
    );
}

export default RequestForm; // exporting the RequestForm component