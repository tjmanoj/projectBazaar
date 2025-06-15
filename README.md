# Project Bazaar

A React + Vite app with Firebase (Firestore, Auth, Storage) and Razorpay integration.

## Features
- Show project list (from Firestore)
- Allow login (Firebase Auth)
- Show demo preview
- Accept payment (Razorpay)
- Deliver source code file (Firebase Storage)
- Admin chat functionality with users

## Setup
1. Install dependencies:
   ```sh
   npm install
   ```
2. Add your Firebase config to `src/firebaseConfig.js`.
3. Start the development server:
   ```sh
   npm run dev
   ```

## Folder Structure
- `src/`
  - `components/` — React components
  - `pages/` — Main app pages (Login, ProjectList, Demo, Payment, Download)
  - `services/` — Service functions for Firebase interactions
  - `context/` — React context providers (Auth, Chat, Theme)
  - `firebaseConfig.js` — Firebase config
  - `App.jsx` — Main app component
  - `main.jsx` — Entry point

## Admin Chat Implementation

The admin chat system allows administrators to:

1. View a list of all registered users
2. See active chat conversations 
3. Respond to user inquiries
4. Track unread messages

Implementation details:

- User data is stored in Firestore (`users` collection) upon signup/login
- Chat messages are stored in Firestore (`chats/{userId}/messages` subcollection)
- Admin interface allows viewing users with or without active chats
- Real-time updates for new messages and unread counts

## Admin Access

To grant admin access to a user:
1. The user must first sign up through the application
2. Admin status can be set in the Firestore `users` collection by setting `isAdmin: true` for that user

## Notes
- Replace placeholder logic and UI with your actual implementation.
- Add your Razorpay key in the payment integration code.
