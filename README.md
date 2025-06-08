# Project Bazaar

A React + Vite app with Firebase (Firestore, Auth, Storage) and Razorpay integration.

## Features
- Show project list (from Firestore)
- Allow login (Firebase Auth)
- Show demo preview
- Accept payment (Razorpay)
- Deliver source code file (Firebase Storage)

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
  - `firebaseConfig.js` — Firebase config
  - `App.jsx` — Main app component
  - `main.jsx` — Entry point

## Notes
- Replace placeholder logic and UI with your actual implementation.
- Add your Razorpay key in the payment integration code.
