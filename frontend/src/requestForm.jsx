import { useState } from "react";

function RequestForm() {
    const [title, setTitle] = useState('');
    const [studentGrade, setStudentGrade] = useState('');
    const [classSubject, setClassSubject] = useState('');
    const [description, setDescription] = useState('');

    async function handleSubmit(e) {

        e.preventDefault();
        const res = await fetch("/api/addrequest", {
            method: 'POST',
            credentials: "include",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({title, studentGrade, classSubject, description})
        });

        const data = await res.json();
        
        if(data.success) {
            navigate("/");
        } else {
            setError(data.message);
        }
    }

    return(
        <form className="requestForm">
            <label htmlFor="title">title:</label>
            <input type="text" id="title" name="title" required onChange={(e) => setTitle(e.target.value)} />

            <label htmlFor="studentGrade">Grade:</label>
            <input type="number" id="studentGrade" name="studentGrade" required onChange={(e) => setStudentGrade(e.target.value)} />

            <label htmlFor="classSubject">Class/Subject:</label>
            <select id="classSubject" name="classSubject" required onChange={(e) => setClassSubject(e.target.value)}>
                <option value="Math">Math</option>
                <option value="English">English</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="Foreign Language">Foreign Language</option>
                <option value="Other">Other</option>
            </select>
            <label htmlFor="description">Description:</label>
            <textarea id="description" name="description" rows="4" onChange={(e) => setDescription(e.target.value)}></textarea>
            <button type="submit" className="submitRequestBtn">Submit Request</button>
        </form>
    );
}

export default RequestForm;