import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import {
  clearSession,
  getStoredUsername,
  hasValidSession,
} from "./auth";
import JobTracker from "./JobTracker";
import Login from "./Login";

function App() {
  const [session, setSession] = useState(() => ({
    isLoggedIn: hasValidSession(),
    username: getStoredUsername(),
  }));

  const handleLogout = useCallback(() => {
    clearSession();
    setSession({
      isLoggedIn: false,
      username: "User",
    });
  }, []);

  const handleLogin = (username) => {
    setSession({
      isLoggedIn: true,
      username: username || getStoredUsername(),
    });
  };

  useEffect(() => {
    if (!hasValidSession()) {
      handleLogout();
    }
  }, [handleLogout]);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            session.isLoggedIn ? (
              <Navigate to="/" />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/"
          element={
            session.isLoggedIn ? (
              <JobTracker
                username={session.username}
                onLogout={handleLogout}
                onSessionExpired={handleLogout}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
