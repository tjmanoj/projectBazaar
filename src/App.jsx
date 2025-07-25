import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
// ThemeProvider is now moved to main.jsx
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import CancellationRefund from "./pages/CancellationRefund";
import ShippingDelivery from "./pages/ShippingDelivery";
import ContactUs from "./pages/ContactUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Signup from "./pages/Signup";
import ProjectList from "./pages/ProjectList";
import ProjectPage from "./pages/ProjectDetails";
import Demo from "./pages/Demo";
import Payment from "./pages/Payment";
import Download from "./pages/Download";
import AdminPanel from "./pages/AdminPanel";
import ChatWidget from "./components/ChatWidget";

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
    <div className="app">
      <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/project/:projectId" element={<ProjectPage />} />
            <Route path="/cancellation-refund" element={<CancellationRefund />} />
            <Route path="/shipping-delivery" element={<ShippingDelivery />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route 
              path="/login" 
              element={currentUser ? <Navigate to="/projects" /> : <Login />} 
            />
            <Route 
              path="/signup" 
              element={currentUser ? <Navigate to="/projects" /> : <Signup />} 
            />

            {/* Protected routes */}
            <Route 
              path="/projects"
              element={<ProjectList />}
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
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
          </Routes>
          {/* Chat Widget for authenticated users */}
          <ChatWidget />
      </div>
  );
}

export default App;
