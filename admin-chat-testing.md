# Admin Chat Testing Guide

This guide explains how to test the admin chat functionality.

## Setup

1. Ensure you have at least one user account and one admin account
2. The admin account should have `isAdmin: true` in the Firestore `users` collection

## Testing User Messages

1. Log in as a regular user
2. Navigate to any page where the chat widget is available
3. Click the chat button in the bottom-right corner
4. Send a test message
5. Log out

## Testing Admin Responses

1. Log in as an admin
2. Navigate to the Admin Panel
3. Click on "Customer Support" in the admin navigation
4. You should see a list of all users in the "All Users" tab
5. In the "Active Chats" tab, you should see users who have started conversations
6. Click on a user to view their chat history
7. Send a reply message

## Debugging

If messages aren't showing up or if you're experiencing other issues:

1. Open the browser console (F12) to check for errors
2. Use the debugging utilities in `src/utils/chatDebug.js`:

```javascript
import { debugUserChat, debugAllChats } from '../utils/chatDebug';

// Check a specific user's chat data
const userId = 'user_id_here';
debugUserChat(userId).then(console.log);

// Check all chat data
debugAllChats().then(console.log);
```

3. Use the test utilities in `src/utils/chatTest.js`:

```javascript
import { simulateUserMessage, testAdminChat } from '../utils/chatTest';

// Simulate a user message
const userId = 'user_id_here';
simulateUserMessage(userId, 'Test message from user').then(console.log);

// Test admin chat functionality
testAdminChat(userId).then(console.log);
```

## Security Rules

The Firestore security rules are set up to ensure:

1. Regular users can only access their own chat data
2. Admins can access all chat data
3. All chat messages are properly secured

If you need to modify the security rules, see `firestore.rules`.
