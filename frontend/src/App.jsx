import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AuthProvider from "./AuthContext.jsx";

import Nav from "./nav.jsx";
import Inbox from './inbox.jsx';
import RequestContainer from './requestContainer.jsx';
import RequestForm from './requestForm.jsx';
import Search from './searchBar.jsx';
import Settings from './settings.jsx';
import Layout from './layout.jsx';
import LoginForm from "./login.jsx"

function App() {
  const [message, setMessage] = useState("Loading...");
  const [currentPage, setCurrentPage] = useState("home");

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
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Inbox />} />
            <Route path="search" element={<Search />} />
            <Route path="requests" element={<RequestContainer />} />
            <Route path="addrequest" element={<RequestForm />} />
            <Route path="login" element={<LoginForm />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );

}

export default App;

