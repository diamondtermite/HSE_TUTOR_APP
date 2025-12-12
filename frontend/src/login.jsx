// import necessary hooks and context
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function LoginForm() {
    /*
    The login form component that allows users to input their email and password to log in
    On submission, it sends a POST request to the /api/login endpoint with the provided credentials
    If login is successful, it updates the auth context and navigates to the home page
    If login fails, it displays an error message
    */

    const {login} = useAuth(); // setup auth context to access the login function
    const navigate = useNavigate(); // setup navigate function to redirect on successful login

    const [email, setEmail] = useState(''); // state for email input
    const [password, setPassword] = useState(''); // state for password input
    const [error, setError] = useState(''); // state for error message

    async function handleSubmit(e) { // function to handle form submission, async to wait for fetch response

        e.preventDefault();
        const res = await fetch("/api/login", { // send POST request to /api/login
            method: 'POST', // use POST method
            credentials: "include", // include cookies for session management
            headers: { "Content-Type": "application/json"}, // set content type to JSON
            body: JSON.stringify({email, password}) // send email and password in request body
        });

        const data = await res.json(); // parse response as JSON, await to ensure data is available
        
        if(data.success) { // if login is successful, login user and navigate to home page
            login(data.user);
            navigate("/");
        } else { // if login fails, set error message to display to user
            setError(data.message);
        }

    }

    /*
    Render the login form with email and password inputs, error message display, and submit button
    
    Inputs
    - Email: type email, required, updates email state on change
    - Password: type password, required, updates password state on change
    - Submit Button: type submit, triggers handleSubmit on click
    
    Error Message - Displays error message in red if error state is set
    */
    return(
        <form className="loginForm" onSubmit={handleSubmit}>
            <label htmlFor="Email">Email:</label>
            <input type="email" id="email" name="email" required onChange={e => setEmail(e.target.value)} />

            <label htmlFor="Password">Password:</label>
            <input type="password" id="password" name="password" required onChange={e => setPassword(e.target.value)} />

            {error && <p style={{ color: "red" }}>{error}</p>}
            <button type="submit" className="loginBtn">Login</button>
        </form>
    );
}

export default LoginForm; // export the LoginForm component