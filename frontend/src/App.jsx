import { useState, useEffect } from 'react';
import Nav from "./nav.jsx";
import Inbox from './inbox.jsx';
import requestsContainer from './request/requestContainer.jsx';
import Search from './searchBar.jsx';
function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("/api/")
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => setMessage("Error: " + err));
  }, []);

  return (
    <div className="app-div">
      <Nav />
      <h1>{message}</h1>
      <h1>Hello!</h1>
      <Inbox />
      <Search id="search-tutor-input" btnId="search-tutor-button" />
      <requestsContainer />
    </div>
  );

}

export default App;



