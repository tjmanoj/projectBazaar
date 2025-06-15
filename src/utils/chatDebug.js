// Debug utility to check user chat data
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

/**
 * Utility function to debug chat data for a specific user
 * @param {string} userId - The user ID to check
 * @returns {Promise<Object>} - The chat data for the user
 */
export const debugUserChat = async (userId) => {
  try {
    console.log(`[DEBUG] Checking chat data for user: ${userId}`);
    
    // 1. Get user data
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    // 2. Get chat messages
    const messagesRef = collection(db, 'chats', userId, 'messages');
    const messagesSnapshot = await getDocs(messagesRef);
    
    const messages = [];
    messagesSnapshot.forEach(doc => {
      messages.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return {
      user: userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null,
      messages: messages,
      messageCount: messages.length
    };
  } catch (error) {
    console.error(`[DEBUG] Error fetching chat data for user ${userId}:`, error);
    return { error: error.message };
  }
};

/**
 * Utility function to debug all chat data
 * @returns {Promise<Object>} - All chat data
 */
export const debugAllChats = async () => {
  try {
    console.log(`[DEBUG] Checking all chat data`);
    
    // Get all chat collections
    const chatsRef = collection(db, 'chats');
    const chatsSnapshot = await getDocs(chatsRef);
    
    const chats = [];
    
    for (const chatDoc of chatsSnapshot.docs) {
      const userId = chatDoc.id;
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      const messagesRef = collection(db, 'chats', userId, 'messages');
      const messagesSnapshot = await getDocs(messagesRef);
      
      const messages = [];
      messagesSnapshot.forEach(doc => {
        messages.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      chats.push({
        userId,
        userData: userDoc.exists() ? userDoc.data() : null,
        messageCount: messages.length,
        hasUnreadMessages: messages.some(m => 
          (m.sender === 'user' && !m.adminRead) || 
          (m.sender === 'admin' && !m.read)
        )
      });
    }
    
    return {
      chatCount: chats.length,
      chats: chats
    };
  } catch (error) {
    console.error(`[DEBUG] Error fetching all chat data:`, error);
    return { error: error.message };
  }
};
