import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  onSnapshot, 
  query, 
  orderBy, 
  where, 
  getDocs, 
  writeBatch,
  doc,
  getDoc,
  limit
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export function useChat() {
  return useContext(ChatContext);
}

export function ChatProvider({ children }) {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // For admin
  const [userChats, setUserChats] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [adminMessages, setAdminMessages] = useState([]);

  useEffect(() => {
    if (!currentUser) {
      setMessages([]);
      setLoading(false);
      return;
    }

    const messagesRef = collection(db, 'chats', currentUser.uid, 'messages');
    const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));
    
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setMessages(newMessages);
      
      // Calculate unread count for user (messages from admin not seen)
      const unread = newMessages.filter(msg => 
        msg.sender === 'admin' && !msg.read
      ).length;
      
      setUnreadCount(unread);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  // For admin: Load list of users with chats
  const loadUserChats = async (isAdmin) => {
    if (!isAdmin || !currentUser) return;
    
    try {
      // Get all chat collections
      const chatCollections = await getDocs(collection(db, 'chats'));
      const users = [];
      
      for (const chatDoc of chatCollections.docs) {
        const userId = chatDoc.id;
        
        // Get the most recent message to show preview
        const messagesRef = collection(db, 'chats', userId, 'messages');
        const latestQuery = query(messagesRef, orderBy('timestamp', 'desc'), limit(1));
        const latestSnapshot = await getDocs(latestQuery);
        
        // Get user info if available
        // This assumes you have a 'users' collection with user profiles
        const userInfoSnapshot = await getDoc(doc(db, 'users', userId));
        const userInfo = userInfoSnapshot.exists() ? userInfoSnapshot.data() : { email: 'Unknown User' };
        
        let latestMessage = null;
        if (!latestSnapshot.empty) {
          const doc = latestSnapshot.docs[0];
          latestMessage = {
            id: doc.id,
            ...doc.data()
          };
        }
        
        // Count unread messages (from user, not read by admin)
        const unreadQuery = query(
          messagesRef, 
          where('sender', '==', 'user'),
          where('adminRead', '==', false)
        );
        const unreadSnapshot = await getDocs(unreadQuery);
        const unreadCount = unreadSnapshot.size;
        
        users.push({
          id: userId,
          name: userInfo.displayName || userInfo.email || userId,
          email: userInfo.email,
          latestMessage,
          unreadCount
        });
      }
      
      setUserChats(users);
    } catch (error) {
      console.error("Error loading user chats:", error);
    }
  };

  // For admin: Load selected user's messages
  useEffect(() => {
    if (!currentUser || !selectedUser) {
      setAdminMessages([]);
      return;
    }
    
    const messagesRef = collection(db, 'chats', selectedUser, 'messages');
    const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));
    
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setAdminMessages(newMessages);
    });

    return unsubscribe;
  }, [currentUser, selectedUser]);

  const sendMessage = async (text) => {
    if (!currentUser || !text.trim()) return;
    
    try {
      const messagesRef = collection(db, 'chats', currentUser.uid, 'messages');
      await addDoc(messagesRef, {
        text: text.trim(),
        sender: 'user',
        timestamp: serverTimestamp(),
        read: false,
        adminRead: false
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const sendAdminMessage = async (text, userId) => {
    if (!currentUser || !text.trim() || !userId) return;
    
    try {
      const messagesRef = collection(db, 'chats', userId, 'messages');
      await addDoc(messagesRef, {
        text: text.trim(),
        sender: 'admin',
        timestamp: serverTimestamp(),
        read: false,
        adminRead: true
      });
    } catch (error) {
      console.error("Error sending admin message:", error);
    }
  };

  // Mark messages as read by user
  const markMessagesAsRead = async () => {
    if (!currentUser) return;
    
    try {
      const batch = writeBatch(db);
      const messagesRef = collection(db, 'chats', currentUser.uid, 'messages');
      const unreadQuery = query(messagesRef, where('sender', '==', 'admin'), where('read', '==', false));
      const unreadSnapshot = await getDocs(unreadQuery);
      
      unreadSnapshot.docs.forEach(doc => {
        batch.update(doc.ref, { read: true });
      });
      
      await batch.commit();
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  // Mark messages as read by admin
  const markMessagesAsAdminRead = async (userId) => {
    if (!currentUser || !userId) return;
    
    try {
      const batch = writeBatch(db);
      const messagesRef = collection(db, 'chats', userId, 'messages');
      const unreadQuery = query(messagesRef, where('sender', '==', 'user'), where('adminRead', '==', false));
      const unreadSnapshot = await getDocs(unreadQuery);
      
      unreadSnapshot.docs.forEach(doc => {
        batch.update(doc.ref, { adminRead: true });
      });
      
      await batch.commit();
    } catch (error) {
      console.error("Error marking messages as admin read:", error);
    }
  };

  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
    if (!isChatOpen) {
      markMessagesAsRead();
    }
  };

  const value = {
    messages,
    loading,
    isChatOpen,
    unreadCount,
    sendMessage,
    toggleChat,
    markMessagesAsRead,
    // Admin functions
    userChats,
    selectedUser,
    setSelectedUser,
    adminMessages,
    loadUserChats,
    sendAdminMessage,
    markMessagesAsAdminRead
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}
