// importing necessary libraries and hooks
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Request from './request.jsx'
import SearchBar from './SearchBar.jsx';
import DropdownFilter from './DropdownFilter.jsx';
import DateRangePicker from './DateRangePicker.jsx';

function RequestContainer({ allRequests = false, openRequests = false, myRequests = false }) {
    const location = useLocation(); // get current location to access query parameters
    const { auth, user } = useAuth();
    const [requests, setRequests] = useState([]); // state to hold fetched requests
    const [volunteeringRequests, setVolunteeringRequests] = useState([]);
    const [selectedTab, setSelectedTab] = useState('unaccepted');
    const [refreshKey, setRefreshKey] = useState(0);
    const [studentSearch, setStudentSearch] = useState('');
    const [tutorSearch, setTutorSearch] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    function parseTimeTo24Hour(timeString) {
        const match = timeString.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
        if (!match) return "00:00";

        let hours = Number(match[1]);
        const minutes = match[2];
        const period = match[3].toUpperCase();

        if (period === "PM" && hours < 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;
        return `${hours.toString().padStart(2, '0')}:${minutes}`;
    }

    function getRequestDateTime(request) {
        const time = parseTimeTo24Hour(request.request_start_time || "00:00");
        return new Date(`${request.request_date}T${time}:00`);
    }

    function isSameOrAfterToday(request) {
        const requestDate = new Date(request.request_date);
        requestDate.setHours(0, 0, 0, 0);
        return requestDate >= today;
    }

    function isAfterNow(request) {
        return getRequestDateTime(request) >= new Date();
    }

    function isWithinWeek(request) {
        const requestDate = new Date(request.request_date);
        requestDate.setHours(0, 0, 0, 0);
        const deltaDays = (requestDate - today) / (1000 * 60 * 60 * 24);
        return deltaDays >= 0 && deltaDays <= 7;
    }

    function isWithinThreeDays(request) {
        const requestDate = new Date(request.request_date);
        requestDate.setHours(0, 0, 0, 0);
        const deltaDays = (requestDate - today) / (1000 * 60 * 60 * 24);
        return deltaDays >= 0 && deltaDays <= 3;
    }

    function sortUpcoming(requestArray) {
        return [...requestArray].sort((a, b) => getRequestDateTime(a) - getRequestDateTime(b));
    }

    function sortDescending(requestArray) {
        return [...requestArray].sort((a, b) => getRequestDateTime(b) - getRequestDateTime(a));
    }

    function timeToMinutes(timeString) {
        const time = parseTimeTo24Hour(timeString || "00:00");
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
    }

    function overlaps(requestA, requestB) {
        if (requestA.request_date !== requestB.request_date) return false;
        const startA = timeToMinutes(requestA.request_start_time);
        const endA = timeToMinutes(requestA.request_end_time);
        const startB = timeToMinutes(requestB.request_start_time);
        const endB = timeToMinutes(requestB.request_end_time);
        return startA < endB && startB < endA;
    }

    function filterNonOverlappingOpenRequests(openRequests, acceptedRequests) {
        return openRequests.filter((req) => {
            return !acceptedRequests.some((accepted) => overlaps(req, accepted));
        });
    }

    const matchesSearch = (name, term) => {
        if (!term) return true;
        return name.toLowerCase().startsWith(term.toLowerCase());
    };

    useEffect(() => {
        const fetchRequests = async (url, setState) => {
            try {
                const response = await fetch(url, { credentials: "include" });
                const data = await response.json();
                setState(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching requests:', error);
                setState([]);
            }
        };

        setRequests([]);
        setVolunteeringRequests([]);

        const performFetches = async () => {
            if (auth === "Student" || auth === "Teacher" || auth === "Tutor") {
                if (auth === "Teacher" && allRequests) {
                    await fetchRequests('/api/requests?include_archived=true', setRequests);
                    setVolunteeringRequests([]);
                } else if (auth === "Teacher" && myRequests) {
                    await fetchRequests('/api/requests?only_self=true', setRequests);
                    setVolunteeringRequests([]);
                } else if (auth === "Tutor" && myRequests) {
                    await fetchRequests('/api/requests?only_self=true', setRequests);
                    await fetchRequests('/api/requests?tutor=true', setVolunteeringRequests);
                } else if (auth === "Tutor" && openRequests) {
                    await fetchRequests('/api/requests?hide_accepted=true&self=false', setRequests);
                    setVolunteeringRequests([]);
                } else {
                    await fetchRequests('/api/requests?only_self=true', setRequests);
                    setVolunteeringRequests([]);
                }
            } else {
                await fetchRequests('/api/requests' + location.search, setRequests);
                setVolunteeringRequests([]);
            }
        };

        performFetches();

    }, [auth, location.search, allRequests, myRequests, openRequests, refreshKey]);

    const futureRequests = requests.filter(isSameOrAfterToday);
    const futureVolunteering = volunteeringRequests.filter(isAfterNow);

    const filteredRequests = auth === "Teacher" && allRequests ? requests.filter(req =>
        matchesSearch(req.student_name || '', studentSearch) &&
        (selectedTab === 'unaccepted' || matchesSearch(req.tutor_name || '', tutorSearch)) &&
        (selectedSubject === '' || req.class_subject === selectedSubject) &&
        (dateFrom === '' || req.request_date >= dateFrom) &&
        (dateTo === '' || req.request_date <= dateTo)
    ) : requests;

    const myAcceptedRequests = sortUpcoming(futureRequests.filter((req) => req.tutor_id != null));
    const myUnacceptedRequests = sortUpcoming(futureRequests.filter((req) => req.tutor_id == null));
    const tutoringRequests = sortUpcoming(futureVolunteering);

    const tutorOpenRequests = auth === "Tutor"
        ? sortUpcoming(requests.filter((req) => req.archived === 0 && req.tutor_id == null && isAfterNow(req) && req.student_id !== (user?.id || -1)))
        : [];

    const allUnaccepted = sortUpcoming(filteredRequests.filter((req) => req.archived === 0 && req.tutor_id == null && isAfterNow(req)));
    const allAccepted = sortUpcoming(filteredRequests.filter((req) => req.archived === 0 && req.tutor_id != null && isAfterNow(req)));
    const allArchived = sortDescending(filteredRequests.filter((req) => req.archived === 1));

    const fetchAndRefresh = () => setRefreshKey((value) => value + 1);

    const archiveRequest = async (request_id) => {
        await fetch(`/api/archive_request/${request_id}`, { method: 'POST', credentials: 'include' });
        fetchAndRefresh();
    };

    const unarchiveRequest = async (request_id) => {
        await fetch(`/api/unarchive_request/${request_id}`, { method: 'POST', credentials: 'include' });
        fetchAndRefresh();
    };

    const removeTutor = async (request_id) => {
        await fetch(`/api/remove_tutor/${request_id}`, { method: 'POST', credentials: 'include' });
        fetchAndRefresh();
    };

    const deleteRequest = async (request_id) => {
        await fetch(`/api/delete_request/${request_id}`, { method: 'POST', credentials: 'include' });
        fetchAndRefresh();
    };

    const removeSelf = async (request_id) => {
        await fetch(`/api/remove_self/${request_id}`, { method: 'POST', credentials: 'include' });
        fetchAndRefresh();
    };

    const renderRequestList = (list, urgent7 = false, urgent3 = false, archivedFuture = false, section = '', onAccept = null) => (
        <div className="requestsDiv">
            {list.length === 0 ? (
                <p className="noRequestsText">No requests to show.</p>
            ) : (
                list.map((req) => (
                    <Request
                        key={req.request_id}
                        {...req}
                        urgent={urgent7 && isWithinWeek(req)}
                        urgent3={urgent3 && isWithinThreeDays(req)}
                        archivedFuture={archivedFuture && req.archived === 1 && isAfterNow(req)}
                        archiveAction={section === 'unaccepted' || section === 'accepted' ? () => archiveRequest(req.request_id) : undefined}
                        unarchiveAction={section === 'archived' && isAfterNow(req) ? () => unarchiveRequest(req.request_id) : undefined}
                        removeTutorAction={section === 'accepted' ? () => removeTutor(req.request_id) : undefined}
                        deleteAction={(!allRequests && user?.id === req.student_id) ? () => deleteRequest(req.request_id) : undefined}
                        removeSelfAction={user?.id === req.tutor_id ? () => removeSelf(req.request_id) : undefined}
                        onAccept={onAccept ? () => onAccept(req.request_id) : undefined}
                    />
                ))
            )}
        </div>
    );

    const renderSection = (title, list, urgent7 = false, urgent3 = false, archivedFuture = false, section = '', onAccept = null) => (
        <section className="requestSection">
            <h1 className="requestHeader">{title}</h1>
            {renderRequestList(list, urgent7, urgent3, archivedFuture, section, onAccept)}
        </section>
    );

    const archivePastRequests = async () => {
        await fetch('/api/archive_past_requests', { method: 'POST', credentials: 'include' });
        fetchAndRefresh();
    };

    const renderTeacherAllRequests = () => (
        <>
            <div className="filters">
                <SearchBar
                    placeholder="Search student name..."
                    value={studentSearch}
                    onChange={setStudentSearch}
                />
                {selectedTab !== 'unaccepted' && (
                    <SearchBar
                        placeholder="Search tutor name..."
                        value={tutorSearch}
                        onChange={setTutorSearch}
                    />
                )}
                <DropdownFilter
                    label="Subject"
                    options={[
                        { value: 'Math', label: 'Math' },
                        { value: 'English', label: 'English' },
                        { value: 'Science', label: 'Science' },
                        { value: 'History', label: 'History' },
                        { value: 'Foreign Language', label: 'Foreign Language' },
                        { value: 'Other', label: 'Other' }
                    ]}
                    value={selectedSubject}
                    onChange={setSelectedSubject}
                    defaultLabel="All Subjects"
                />
                <DateRangePicker
                    fromDate={dateFrom}
                    toDate={dateTo}
                    onFromChange={setDateFrom}
                    onToChange={setDateTo}
                />
            </div>
            <div className="requestTabs">
                <button className={selectedTab === 'unaccepted' ? 'activeTab' : ''} onClick={() => setSelectedTab('unaccepted')}>Unaccepted Requests</button>
                <button className={selectedTab === 'accepted' ? 'activeTab' : ''} onClick={() => setSelectedTab('accepted')}>Accepted Requests</button>
                <button className={selectedTab === 'archived' ? 'activeTab' : ''} onClick={async () => { await archivePastRequests(); setSelectedTab('archived'); }}>Archived</button>
            </div>
            {selectedTab === 'unaccepted' && renderSection('Unaccepted Requests', allUnaccepted, false, true, false, 'unaccepted')}
            {selectedTab === 'accepted' && renderSection('Accepted Requests', allAccepted, false, true, false, 'accepted')}
            {selectedTab === 'archived' && renderSection('Archived', allArchived, false, false, true, 'archived')}
        </>
    );

    return (
        <div className="requestContainer">
            {auth === "Teacher" && allRequests ? (
                renderTeacherAllRequests()
            ) : auth === "Teacher" && myRequests ? (
                <>
                    {renderSection('My Accepted Requests', myAcceptedRequests, true)}
                    {renderSection('My Unaccepted Requests', myUnacceptedRequests, false)}
                </>
            ) : auth === "Tutor" && myRequests ? (
                <>
                    {renderSection('My Volunteering', tutoringRequests, true)}
                    {renderSection('My Accepted Requests', myAcceptedRequests, true)}
                    {renderSection('My Unaccepted Requests', myUnacceptedRequests, false)}
                </>
            ) : auth === "Tutor" && openRequests ? (
                <>
                    {renderSection('Requests', tutorOpenRequests, false, false, false, '', (requestId) => setRequests(prev => prev.filter(r => r.request_id !== requestId)))}
                </>
            ) : auth === "Student" ? (
                <>
                    {renderSection('My Accepted Requests', myAcceptedRequests, true)}
                    {renderSection('My Unaccepted Requests', myUnacceptedRequests, false)}
                </>
            ) : (
                <>
                    <h1 className="requestHeader">Requests:</h1>
                    {renderRequestList(sortUpcoming(requests))}
                </>
            )}
        </div>
    );
}

export default RequestContainer; // exporting the RequestContainer component


