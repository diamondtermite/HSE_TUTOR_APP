import { useState, useEffect } from 'react';
import Nav from "./nav.jsx";
import Inbox from './inbox.jsx';
import RequestsContainer from './requestContainer.jsx';
import Search from './searchBar.jsx';
import Settings from './settings.jsx';

function App() {
  const [message, setMessage] = useState("Loading...");
  const [currentPage, setCurrentPage] = useState("home");

  useEffect(() => {
    fetch("/api/")
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => setMessage("Error: " + err));
  }, []);

//-----------------------------------------------------------------------------
  // Define the different pages and what they look like
  const pages = {
    home: (
      <>
        <h1>{message}</h1>
        <h2>Hello!</h2>
        <Inbox />
      </>
    ),
    search: (
      <div>
        <h1>Search Tutors</h1>
        <Search id="search-tutor-input" btnId="search-tutor-button" />
      </div>
    ),
    requests: (
      <div>
        <h1>Requests</h1>
        <RequestsContainer />
      </div>
    ),
    settings: (
      <div>
        <h1>Settings</h1>
        <Settings />
      </div>
    ),
  };
//-----------------------------------------------------------------------------

  return (
    <div className="app-div">
      <Nav currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {pages[currentPage] ?? pages.home}
    </div>
  );
}

export default App;

