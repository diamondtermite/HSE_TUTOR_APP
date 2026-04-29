import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

function ClubForm() {
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const { user, login } = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!code.trim()) {
            setError("Please enter a club code.");
            return;
        }

        try {
            const res = await fetch("/api/join_club", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: code.trim() })
            });

            const data = await res.json();

            if (data.success) {
                setSuccess(`Successfully joined ${data.club_name}!`);
                setCode(""); // Clear the input field
                
                // If student was upgraded to tutor, update auth context
                if (data.is_new_tutor) {
                    const updatedUser = { ...user, auth: "Tutor" };
                    login(updatedUser);
                }

                // Clear success message after 5 seconds
                setTimeout(() => {
                    setSuccess("");
                }, 5000);
            } else {
                setError(data.message || "Failed to join club.");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
            console.error(err);
        }
    }

    return (
        <div className="clubFormContainer">
            <h1>Join a Club</h1>
            <p>Enter the 4-digit code for the club or honor society you are a member of.</p>
            
            <form className="clubForm" onSubmit={handleSubmit}>
                <label htmlFor="code">Club Code:</label>
                <input
                    type="text"
                    id="code"
                    name="code"
                    placeholder="Enter 4-digit code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    maxLength="4"
                    required
                />
                
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                
                <button type="submit" className="submitClubBtn">Join Club</button>
            </form>
        </div>
    );
}

export default ClubForm;
