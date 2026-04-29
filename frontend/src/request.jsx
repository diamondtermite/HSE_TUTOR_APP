// importing necessary libraries and hooks
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

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
        
        if (data.success) {
            if (props.onAccept) {
                props.onAccept(); // call the callback to update the list
            } else {
                navigate("/requests"); // fallback to navigation if no callback
            }
        } else {
            alert("Error accepting request: " + data.message); // alert user if there was an error
        }
    }
    /* 
    Rendering the request component with student details and request information.
    Information displayed includes student name, grade, subject, date, time, and location.
    If the logged-in user is the student who made the request or a teacher, display tutor information.
    Otherwise, provide an option to accept the request.
    */
    const classes = ['requestBox'];
    if (props.urgent) classes.push('urgentRequest');
    if (props.urgent3) classes.push('urgentRequest3');
    if (props.archivedFuture) classes.push('archivedFuture');

    return (
        <div className={classes.join(' ')}>
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
            
            { user && (user.id === props.student_id || auth === 'Teacher' || props.tutor_id != null) ? 
                <div className='requestTutorInfo'>
                    {user && user.id !== props.tutor_id && (
                        <>
                            <p>{props.tutor_id != null ? "Tutor: " + props.tutor_name : "No tutor assigned yet"}</p>
                            {props.tutor_id != null && props.tutor_email && (
                                <p>{`Email: ${props.tutor_email}`}</p>
                            )}
                        </>
                    )}
                </div>
                :
                <div className='requestActions'>
                    <button className='acceptRqBtn' onClick={handleAccept}>accept</button>
                </div>
            }

            {(props.archiveAction || props.unarchiveAction || props.removeTutorAction || props.deleteAction || props.removeSelfAction) && (
                <div className='requestActions'>
                    {props.archiveAction && <button className='archiveBtn' onClick={props.archiveAction}>Archive</button>}
                    {props.unarchiveAction && <button className='unarchiveBtn' onClick={props.unarchiveAction}>Unarchive</button>}
                    {props.removeTutorAction && <button className='removeTutorBtn' onClick={props.removeTutorAction}>Remove Tutor</button>}
                    {props.deleteAction && <button className='deleteBtn' onClick={props.deleteAction}>Delete</button>}
                    {props.removeSelfAction && <button className='removeSelfBtn' onClick={props.removeSelfAction}>Remove Self</button>}
                </div>
            )}
        </div>
    );
}

export default request; // exporting the request component
