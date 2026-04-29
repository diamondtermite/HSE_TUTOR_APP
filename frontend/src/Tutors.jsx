import { useState, useEffect } from "react";
import SearchBar from './SearchBar.jsx';
import DropdownFilter from './DropdownFilter.jsx';

function Tutors() {
    const [tutors, setTutors] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGrades, setSelectedGrades] = useState([]);
    const [selectedClub, setSelectedClub] = useState('');

    useEffect(() => {
        fetch('/api/tutors', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setTutors(data))
            .catch(err => console.error('Error fetching tutors:', err));

        fetch('/api/clubs', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setClubs(data))
            .catch(err => console.error('Error fetching clubs:', err));
    }, []);

    const allGrades = [9, 10, 11, 12];

    const matchesSearch = (name, term) => {
        if (!term) return true;
        return name.toLowerCase().startsWith(term.toLowerCase());
    };

    const filteredTutors = tutors.filter(tutor => {
        const matchesSearchTerm = matchesSearch(tutor.user_name, searchTerm);
        const matchesGrade = selectedGrades.length === 0 || selectedGrades.includes(parseInt(tutor.user_grade));
        const matchesClub = !selectedClub || tutor.clubs.includes(selectedClub);
        return matchesSearchTerm && matchesGrade && matchesClub;
    });

    return (
        <div className="tutorsPage">
            <h1>Tutors</h1>
            <div className="filters">
                <SearchBar
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={setSearchTerm}
                />
                <DropdownFilter
                    label="Grades"
                    options={allGrades.map(grade => ({ value: grade, label: `Grade ${grade}` }))}
                    value={selectedGrades.length > 0 ? selectedGrades[0] : ''}
                    onChange={(value) => setSelectedGrades(value ? [parseInt(value)] : [])}
                    defaultLabel="Grades"
                />
                <DropdownFilter
                    label="Clubs"
                    options={clubs.map(club => ({ value: club.club_name, label: club.club_name }))}
                    value={selectedClub}
                    onChange={setSelectedClub}
                    defaultLabel="All Clubs"
                />
            </div>
            <div className="tutorsList">
                {filteredTutors.length === 0 ? (
                    <p>No tutors found.</p>
                ) : (
                    filteredTutors.map((tutor, index) => (
                        <div key={index} className="tutorCard">
                            <p><strong>Name:</strong> {tutor.user_name}</p>
                            <p><strong>Grade:</strong> {tutor.user_grade}</p>
                            <p><strong>Email:</strong> {tutor.user_email}</p>
                            <p><strong>Clubs:</strong> {tutor.clubs.length > 0 ? tutor.clubs.join(', ') : 'No clubs'}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Tutors;