import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from "./nav.jsx";
import Inbox from './inbox.jsx';
import RequestsContainer from './requestContainer.jsx';
import RequestForm from './requestForm.jsx';
import Search from './searchBar.jsx';
import Settings from './settings.jsx';

function App() {
  const [message, setMessage] = useState("Loading...");
  const [currentPage, setCurrentPage] = useState("home");
  //const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/")
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => setMessage("Error: " + err));
  }, []);

const permissions = {
    canViewInbox: true,
    canSearchTutors: true,
    canViewRequests: true,
    canChangeSettings: true,
  };

return (
  <BrowserRouter>
    <Routes>
        <Route path="/" element={<Inbox />} />
        <Route path="/search" element={<Search />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/settings" element={<Settings />} />
    </Routes>
  </BrowserRouter>
);

// //-----------------------------------------------------------------------------
//   // Define the different pages and what they look like
//   const pages = {
//     home: permissions.canViewInbox && (
//       <div className='wrap-div'>
//         <h1>{message}</h1>
//         <h2>Hello!</h2>
//         <Inbox />
//       </div>
//     ),
//     search: permissions.canSearchTutors && (
//       <div className='wrap-div'>
//         <h1>Search Tutors</h1>
//         <Search id="search-tutor-input" btnId="search-tutor-button" />
//       </div>
//     ),
//     requests: permissions.canViewRequests && (
//       <div className='wrap-div'>
//         <h1>Requests</h1>
//         <RequestsContainer />``
//       </div>
//     ),
//     settings: permissions.canChangeSettings && (
//       <div className='wrap-div'>
//         <h1>Settings</h1>
//         <Settings />
//       </div>
//     ),
//   };
// //-----------------------------------------------------------------------------

//   return (
//     <div className="app-div">
//       <Nav currentPage={currentPage} setCurrentPage={setCurrentPage} />
//       {pages[currentPage] ?? pages.home}
//     </div>
//   );
}

export default App;

