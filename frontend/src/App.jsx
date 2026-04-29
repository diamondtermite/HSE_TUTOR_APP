// import necessary libraries and contexts
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import AuthProvider, { useAuth } from "./AuthContext.jsx"; // important context that allows for authentication state management across the app

import Nav from "./nav.jsx"; // navigation component
import Inbox from './inbox.jsx'; // inbox component
import RequestContainer from './requestContainer.jsx'; // request container component
import RequestForm from './requestForm.jsx'; // request form component
import Settings from './settings.jsx'; // settings component
import Layout from './layout.jsx'; // layout component
import LoginForm from "./login.jsx" // login form component
import Tutors from './Tutors.jsx'; // tutors component
import ClubForm from './ClubForm.jsx'; // club form component

function RequireAuth() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

function App() {
  const [message, setMessage] = useState("Loading..."); // state to hold messages from backend

  useEffect(() => { // side effect to fetch initial message from backend
    fetch("/api/") // fetching from the backend API
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => setMessage("Error: " + err));
  }, []); // empty dependency array means this runs once on component mount

  /* 
  The main return of the App component, setting up routing and context providers.

  AuthProvider - wraps the entire application that allows all child components to access authentication state and methods and prevents prop drilling
  BrowserRouter - enables routing in the app between different components based on the URL
  Routes - defines all the routes in the application
  Route (Layout) - a wrapper route that contains common layout elements (like Nav) for all child routes, allowing for consistent UI
  Route (index) - the default route that renders the Inbox component
  Other Routes - define paths for search, requests, adding requests, login, and settings, each rendering their respective components
  */
  return (
      <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Inbox />} />
            <Route path="login" element={<LoginForm />} />
            <Route element={<RequireAuth />}>
              <Route path="requests" element={<RequestContainer openRequests={true} />} />
              <Route path="myrequests" element={<RequestContainer myRequests={true} />} />
              <Route path="allrequests" element={<RequestContainer allRequests={true} />} />
              <Route path="addrequest" element={<RequestForm />} />              <Route path="tutors" element={<Tutors />} />              <Route path="settings" element={<Settings />} />
              <Route path="joinclub" element={<ClubForm />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );

}

export default App; // export the App component as the default export

