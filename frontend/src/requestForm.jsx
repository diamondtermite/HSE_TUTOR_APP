function requestForm() {

    return(
        <form className="requestForm">
            <label htmlFor="Title">title:</label>
            <input type="text" id="Title" name="Title" required />

            <label htmlFor="studentGrade">Grade:</label>
            <input type="number" id="studentGrade" name="studentGrade" required />

            <label htmlFor="classSubject">Class/Subject:</label>
            <select id="classSubject" name="classSubject" required>
                <option value="Math">Math</option>
                <option value="English">English</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="Foreign Language">Foreign Language</option>
                <option value="Other">Other</option>
            </select>
            <label htmlFor="Description">Description:</label>
            <textarea id="additionalInfo" name="Description" rows="4"></textarea>
            <button type="submit" className="submitRequestBtn">Submit Request</button>
        </form>
    );
}

export default requestForm;