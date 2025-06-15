# Components Directory

This directory contains reusable components used throughout the application.

## Project Components

- `ProjectCard.tsx` - Displays project information in a card format

## Chat Components

- `ChatButton.jsx` - Floating button to open the chat widget for users
- `ChatModal.jsx` - The modal that contains the chat interface for users
- `ChatWidget.jsx` - The main chat widget component for users

## Admin Chat Components

- `AdminChat.jsx` - Main admin chat interface component
- `AdminChatMessages.jsx` - Component for displaying chat messages in the admin interface
- `AdminChatUserList.jsx` - Component for displaying the list of users and their active chats

### AdminChatUserList.jsx

This component provides two views for administrators:

1. **Active Chats Tab** - Shows only users who have initiated a chat
   - Displays user email/name
   - Shows latest message preview
   - Indicates unread message count
   - Sorts by most recent activity

2. **All Users Tab** - Shows all registered users from Firestore
   - Displays user email/name
   - Indicates if the user has an active chat
   - Allows initiating a new conversation with users who haven't started a chat

The component fetches user data from the Firestore `users` collection and combines it with chat information to create a seamless admin experience.

## Demo Components

- `DemoModal.jsx` - Modal for displaying project demos
