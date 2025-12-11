import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function LoginForm() {
    const {login} = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function handleSubmit(e) {

        e.preventDefault();
        const res = await fetch("/api/login", {
            method: 'POST',
            credentials: "include",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({email, password})
        });

        const data = await res.json();
        
        if(data.success) {
            login(data.user);
            navigate("/");
        } else {
            setError(data.message);
        }

    }

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

export default LoginForm;