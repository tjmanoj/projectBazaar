// Test utility for admin chat functionality
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { debugUserChat, debugAllChats } from './chatDebug';

/**
 * Simulate a user sending a message
 * @param {string} userId - The user ID 
 * @param {string} text - Message text
 * @returns {Promise<Object>} - The created message
 */
export const simulateUserMessage = async (userId, text) => {
  try {
    console.log(`[TEST] Simulating user message from user ${userId}: ${text}`);
    
    const messagesRef = collection(db, 'chats', userId, 'messages');
    const docRef = await addDoc(messagesRef, {
      text: text,
      sender: 'user',
      timestamp: serverTimestamp(),
      read: false, 
      adminRead: false 
    });
    
    console.log(`[TEST] User message created with ID: ${docRef.id}`);
    return { success: true, messageId: docRef.id };
  } catch (error) {
    console.error(`[TEST] Error simulating user message:`, error);
    return { error: error.message };
  }
};

/**
 * Test admin chat functionality by:
 * 1. Checking if admin can access all chats
 * 2. Checking if admin can send messages to a user
 * 3. Checking if messages are properly stored
 */
export const testAdminChat = async (userId) => {
  try {
    console.log(`[TEST] Running admin chat test for user ${userId}`);
    
    // Check user chat before
    const beforeData = await debugUserChat(userId);
    console.log(`[TEST] User chat before: ${beforeData.messageCount} messages`);
    
    // Simulate admin message
    const adminMessageText = `Test admin message at ${new Date().toISOString()}`;
    const messagesRef = collection(db, 'chats', userId, 'messages');
    const docRef = await addDoc(messagesRef, {
      text: adminMessageText,
      sender: 'admin',
      timestamp: serverTimestamp(),
      read: false, 
      adminRead: true
    });
    
    console.log(`[TEST] Admin message created with ID: ${docRef.id}`);
    
    // Check user chat after
    const afterData = await debugUserChat(userId);
    console.log(`[TEST] User chat after: ${afterData.messageCount} messages`);
    
    return {
      success: true,
      before: beforeData,
      after: afterData,
      messageAdded: afterData.messageCount > beforeData.messageCount
    };
  } catch (error) {
    console.error(`[TEST] Error testing admin chat:`, error);
    return { error: error.message };
  }
};
