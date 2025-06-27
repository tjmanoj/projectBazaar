import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useEffect, useState } from 'react';
import ChatButton from './ChatButton';
import ChatModal from './ChatModal';

const ChatWidget = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Check if the user is an admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!currentUser) return;
      
      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        setIsAdmin(userDoc.exists() && userDoc.data().isAdmin === true);
      } catch (err) {
        console.error("Error checking admin status:", err);
        setIsAdmin(false);
      }
    };
    
    checkAdminStatus();
  }, [currentUser]);
  
  // Get current path to determine if we should show the chat widget
  const path = location.pathname;
  const isAuthPage = path === '/login' || path === '/signup';
  const isAdminPage = path === '/admin';
  const isLandingPage = path === '/';
  
  // Hide chat widget on landing page, auth pages, and admin page (for admin users)
  if (!currentUser || isAuthPage || isLandingPage || (isAdmin && isAdminPage)) return null;

  return (
    <>
      <ChatButton />
      <ChatModal />
    </>
  );
};

export default ChatWidget;
