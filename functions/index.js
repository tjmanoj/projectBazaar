const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");

// Initialize admin SDK
initializeApp();

/**
 * List all users with their UIDs and email addresses
 * This function is protected and can only be called by admin users
 * NOTE: This Cloud Function is now used as a fallback only.
 * The primary implementation now uses Firestore users collection directly.
 */
exports.listUsers = onCall({ 
  enforceAppCheck: false // Set to true in production
}, async (request) => {
  try {
    // Check if the request is authenticated
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    // Get user claims to check admin status
    const userRecord = await getAuth().getUser(request.auth.uid);
    const isAdmin = userRecord.customClaims && userRecord.customClaims.admin === true;

    if (!isAdmin) {
      throw new HttpsError('permission-denied', 'The function must be called by an admin user.');
    }

    // Get users from Firestore instead of Firebase Auth
    const db = getFirestore();
    const usersSnapshot = await db.collection('users').get();
    
    const users = [];
    usersSnapshot.forEach(doc => {
      users.push({
        uid: doc.id,
        ...doc.data()
      });
    });
    
    return { users };
  } catch (error) {
    console.error('Error listing users:', error);
    throw new HttpsError('internal', 'Error listing users: ' + error.message);
  }
});
