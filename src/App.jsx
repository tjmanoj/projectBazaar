import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { ThemeProvider } from './context/ThemeContext';
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProjectList from "./pages/ProjectList";
import Demo from "./pages/Demo";
import Payment from "./pages/Payment";
import Download from "./pages/Download";

// ProtectedRoute component
function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  const { currentUser } = useAuth();

  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route 
              path="/login" 
              element={currentUser ? <Navigate to="/dashboard" /> : <Login />} 
            />
            <Route 
              path="/signup" 
              element={currentUser ? <Navigate to="/dashboard" /> : <Signup />} 
            />

            {/* Protected routes */}
            <Route 
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <ProjectList />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/demo/:projectId" 
              element={
                <ProtectedRoute>
                  <Demo />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/payment/:projectId" 
              element={
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/download/:projectId" 
              element={
                <ProtectedRoute>
                  <Download />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
