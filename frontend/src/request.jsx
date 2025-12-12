// importing necessary libraries and hooks
import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate, Link } from "react-router-dom";

function request(props) {
    const { user, auth } = useAuth(); // get user and auth info from context
    const navigate = useNavigate(); 

    const handleAccept = async () => { // function to handle accepting a request, makes a POST request to the server
        const res = await fetch(`/api/acceptrequest/${props.request_id}`, { // using the request_id from props to identify the request
            method: 'POST', // POST method to accept the request
            credentials: "include", // include credentials for authentication
            headers: { "Content-Type": "application/json"}, // setting content type to JSON
        });

        const data = await res.json();
        
        navigate("/requests")
        if (!data.success) {
            alert("Error accepting request: " + data.message); // alert user if there was an error
        }
    }
    /* 
    Rendering the request component with student details and request information.
    Information displayed includes student name, grade, subject, date, time, and location.
    If the logged-in user is the student who made the request or a teacher, display tutor information.
    Otherwise, provide an option to accept the request.
    */
    return (
        <div className='requestBox'>
            <div className='requestBoxHeader'></div>
            <div className="requestStudentProfile">
                <img alt="placeholder" />
                <div className="requestStudentInfo">
                    <p>{props.student_name}</p>
                    <p>{props.student_grade}</p>
                </div>
            </div>
            <p className="requestDetails">{props.request_subject}</p>
            <p className="requestDetails">{props.request_date}</p>
            <p className="requestDetails">{props.request_start_time} - {props.request_end_time}</p>
            <p className="requestDetails">{props.request_location}</p>
            
            { user.id === props.student_id || auth === 'Teacher' ? 
                <p>{props.tutor_id != null ? "Tutor: " + props.tutor_name : "No tutor assigned yet"}</p> 
                :
                <div className='requestActions'>
                    <button className='acceptRqBtn' onClick={handleAccept}>accept</button>
                </div>
            }
        </div>
    );
}

export default request; // exporting the request component
