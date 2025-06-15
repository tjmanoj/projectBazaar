import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebaseConfig';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  writeBatch, 
  where, 
  getDocs, 
  doc, 
  getDoc,
  limit // Added limit import
} from 'firebase/firestore';

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
  const [adminMessages, setAdminMessages] = useState([]); // Initialize as empty array
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false); // Corrected initial state
  const [adminError, setAdminError] = useState(null);

  // Detect admin status
  useEffect(() => {
    if (!currentUser) {
      console.log('[ChatContext] No current user, setting isAdmin to false.');
      setIsAdmin(false);
      return;
    }
    const checkAdmin = async () => {
      console.log('[ChatContext] Checking admin status for user:', currentUser.uid);
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef); // Renamed to avoid conflict
        if (userDocSnap.exists() && userDocSnap.data().isAdmin) {
          console.log('[ChatContext] User is admin:', currentUser.uid);
          setIsAdmin(true);
        } else {
          console.log('[ChatContext] User is NOT admin or user doc does not exist. Data:', userDocSnap.exists() ? userDocSnap.data() : 'No doc');
          setIsAdmin(false);
        }
      } catch (err) {
        console.error('[ChatContext] Error checking admin status:', err);
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, [currentUser]);

  // User messages (for normal users)
  useEffect(() => {
    if (!currentUser || isAdmin) {
      setMessages([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const messagesRef = collection(db, 'chats', currentUser.uid, 'messages');
    const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const newMessages = snapshot.docs.map(docData => ({ // Renamed doc to docData
        id: docData.id,
        ...docData.data()
      }));
      setMessages(newMessages);
      const unread = newMessages.filter(msg => 
        msg.sender === 'admin' && !msg.read
      ).length;
      setUnreadCount(unread);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching user messages:", error);
      setLoading(false);
    });
    return unsubscribe;
  }, [currentUser, isAdmin]);

  // Admin: Load all user chats
  const loadUserChats = useCallback(async (forceRefresh = false) => {
    console.log('[ChatContext Admin] loadUserChats called. isAdmin:', isAdmin, 'currentUser:', currentUser?.uid, 'forceRefresh:', forceRefresh);
    if (!isAdmin || !currentUser) {
      console.log('[ChatContext Admin] Not admin or no current user, clearing userChats.');
      setUserChats([]);
      return [];
    }

    setAdminLoading(true);
    setAdminError(null);
    console.log('[ChatContext Admin] Attempting to fetch chat collections from Firestore path: "chats"');

    try {
      const chatsCollectionRef = collection(db, 'chats');
      const chatCollectionsSnapshot = await getDocs(chatsCollectionRef);

      console.log('[ChatContext Admin] Fetched chat collections. Number of chat documents (users):', chatCollectionsSnapshot.docs.length);
      if (chatCollectionsSnapshot.empty) {
        console.warn('[ChatContext Admin] No chat documents found in "chats" collection.');
      }

      const usersPromises = chatCollectionsSnapshot.docs.map(async (chatDoc) => {
        const userId = chatDoc.id;
        // console.log(`[ChatContext Admin] Processing chat for user ID: ${userId}`); // Can be verbose
        const userDocRef = doc(db, 'users', userId);
        const messagesRef = collection(db, 'chats', userId, 'messages');
        const latestMessageQuery = query(messagesRef, orderBy('timestamp', 'desc'), limit(1));
        const unreadMessagesQuery = query(messagesRef, where('sender', '==', 'user'), where('adminRead', '==', false));

        try {
          const [userDocSnap, latestMessageSnap, unreadMessagesSnap] = await Promise.all([
            getDoc(userDocRef),
            getDocs(latestMessageQuery),
            getDocs(unreadMessagesQuery)
          ]);

          const userName = userDocSnap.exists() ? userDocSnap.data().displayName || userDocSnap.data().email : `User (${userId.substring(0,6)})`;
          const userEmail = userDocSnap.exists() ? userDocSnap.data().email : 'No email';
          const latestMessageData = latestMessageSnap.docs.length > 0 ? latestMessageSnap.docs[0].data() : null;
          const unreadCountValue = unreadMessagesSnap.size; // Renamed

          // console.log(`[ChatContext Admin] User: ${userName}, Unread: ${unreadCountValue}, Latest Msg:`, latestMessageData); // Can be verbose

          return {
            id: userId,
            name: userName,
            email: userEmail,
            latestMessage: latestMessageData,
            unreadCount: unreadCountValue,
            lastActivity: latestMessageData ? latestMessageData.timestamp : null
          };
        } catch (error) {
          console.error(`[ChatContext Admin] Error processing user chat data for ${userId}:`, error);
          return { // Return a placeholder on error
            id: userId,
            name: `Error (${userId.substring(0,6)})`,
            email: 'Error',
            latestMessage: null,
            unreadCount: 0,
            lastActivity: null
          };
        }
      });

      let users = await Promise.all(usersPromises);
      
      users.sort((a, b) => {
        const aTime = a.lastActivity?.toMillis() || 0;
        const bTime = b.lastActivity?.toMillis() || 0;
        return bTime - aTime; // Sort by most recent activity
      });
      
      console.log('[ChatContext Admin] Successfully processed user chats. Count:', users.length, users);
      setUserChats(users);
      setAdminLoading(false);
      return users;
    } catch (error) {
      console.error('[ChatContext Admin] Critical error fetching user chats:', error);
      setAdminError('Failed to load user chats. See console for details.');
      setAdminLoading(false);
      setUserChats([]);
      return [];
    }
  }, [isAdmin, currentUser]);

  // Auto-load user chats when admin logs in or when `isAdmin` status is confirmed
  useEffect(() => {
    console.log('[ChatContext Admin] Admin status or current user changed. isAdmin:', isAdmin, 'currentUser:', !!currentUser);
    if (isAdmin && currentUser) {
      console.log('[ChatContext Admin] Conditions met, calling loadUserChats.');
      loadUserChats();
    } else {
      console.log('[ChatContext Admin] Conditions NOT met for loading user chats, ensuring userChats is empty.');
      setUserChats([]); 
    }
  }, [isAdmin, currentUser, loadUserChats]);

  // For admin: Load selected user's messages
  useEffect(() => {
    if (!currentUser || !selectedUser || !isAdmin) {
      setAdminMessages([]);
      return;
    }
    setAdminMessages(null); // Indicate loading for admin messages
    const messagesRef = collection(db, 'chats', selectedUser, 'messages');
    const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const newMessages = snapshot.docs.map(docData => ({ // Renamed doc to docData
        id: docData.id,
        ...docData.data()
      }));
      console.log('[ADMIN] Fetched', newMessages.length, 'messages for user', selectedUser); // Removed messages from log for brevity
      setAdminMessages(newMessages);
    }, error => {
      console.error('[ADMIN] Error fetching messages for user', selectedUser, error);
      setAdminMessages([]); // Set to empty array on error
    });
    return unsubscribe;
  }, [currentUser, selectedUser, isAdmin]);

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
      // Optimistically update user details in userChats for admin
      if (isAdmin) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            // This part is tricky as sendMessage is for the current user, not necessarily an admin sending to someone.
            // This might be better handled by a separate function or by re-fetching userChats.
            // For now, let's assume this is a user sending a message, and admin view will update via loadUserChats.
        }
      }

    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const sendAdminMessage = async (text, userId) => {
    if (!currentUser || !text.trim() || !userId || !isAdmin) return;
    
    try {
      const messagesRef = collection(db, 'chats', userId, 'messages');
      await addDoc(messagesRef, {
        text: text.trim(),
        sender: 'admin',
        timestamp: serverTimestamp(),
        read: false, 
        adminRead: true 
      });
      // Optionally, trigger a refresh of userChats or update the specific user's last message
      // This is to make the admin user list update more reactively.
      // loadUserChats(true); // Or a more targeted update
    } catch (error) {
      console.error("Error sending admin message:", error);
    }
  };

  const markMessagesAsRead = async () => {
    if (!currentUser || isAdmin) return; // Only for normal users
    
    try {
      const batch = writeBatch(db);
      const messagesRef = collection(db, 'chats', currentUser.uid, 'messages');
      const unreadQuery = query(messagesRef, where('sender', '==', 'admin'), where('read', '==', false));
      const unreadSnapshot = await getDocs(unreadQuery);
      
      if (unreadSnapshot.empty) return;

      unreadSnapshot.docs.forEach(docRef => { // Renamed doc to docRef
        batch.update(docRef.ref, { read: true });
      });
      
      await batch.commit();
      console.log('[ChatContext] User marked admin messages as read.');
    } catch (error) {
      console.error("Error marking messages as read by user:", error);
    }
  };

  const markMessagesAsAdminRead = async (userId) => {
    if (!currentUser || !userId || !isAdmin) return;
    
    try {
      // console.log(`[ChatContext Admin] Marking messages as read for user: ${userId}`); // Can be verbose
      const batch = writeBatch(db);
      const messagesRef = collection(db, 'chats', userId, 'messages');
      const unreadQuery = query(messagesRef, where('sender', '==', 'user'), where('adminRead', '==', false));
      const unreadSnapshot = await getDocs(unreadQuery);
      
      // console.log(`[ChatContext Admin] Found ${unreadSnapshot.docs.length} unread messages from user ${userId} to mark as adminRead`); // Can be verbose
      
      if (unreadSnapshot.empty) {
        // console.log(`[ChatContext Admin] No unread messages from user ${userId} to mark as adminRead.`); // Can be verbose
        return; 
      }
      
      unreadSnapshot.docs.forEach(docRef => { // Renamed doc to docRef
        batch.update(docRef.ref, { adminRead: true });
      });
      
      await batch.commit();
      console.log(`[ChatContext Admin] Admin marked messages from user ${userId} as read.`);
      
      // Update unread count in local state for immediate UI feedback
      setUserChats(prevUserChats => 
        prevUserChats.map(chat => 
          chat.id === userId ? { ...chat, unreadCount: 0 } : chat
        )
      );

    } catch (error) {
      console.error(`Error marking messages as adminRead for user ${userId}:`, error);
    }
  };

  const toggleChat = () => {
    setIsChatOpen(prev => {
      const newChatOpenState = !prev;
      if (newChatOpenState && !isAdmin && currentUser) { // If opening chat as a normal user
        markMessagesAsRead();
      }
      return newChatOpenState;
    });
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
    markMessagesAsAdminRead,
    isAdmin,
    adminLoading,
    adminError
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}
