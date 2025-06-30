import { db } from '../firebaseConfig';
import { collection, getDocs, query, orderBy, doc, updateDoc, getDoc, increment, setDoc } from 'firebase/firestore';

/**
 * Fetch all registered users from Firestore users collection
 * This assumes users have been stored in Firestore on signup/login
 * @returns {Promise<Array>} Array of users with their UIDs and other information
 */
export const fetchAllUsers = async () => {
  try {
    // Create a query against the users collection
    const usersRef = collection(db, 'users');
    // Order by the most recently created users first
    const usersQuery = query(usersRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(usersQuery);
    
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({
        uid: doc.id,
        ...doc.data()
      });
    });
    
    return users;
  } catch (error) {
    console.error('Error fetching users from Firestore:', error);
    throw error;
  }
};

/**
 * Update the download count for a user and project
 * @param {string} userId - The ID of the user
 * @param {string} projectId - The ID of the project
 */
async function updateDownloadCount(userId, projectId) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      [`downloads.${projectId}`]: increment(1)
    });
  } catch (error) {
    console.error('Error updating download count:', error);
    throw error;
  }
}

/**
 * Get the download count for a user and project
 * @param {string} userId - The ID of the user
 * @param {string} projectId - The ID of the project
 * @returns {Promise<number>} - The download count
 */
async function getDownloadCount(userId, projectId) {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    const data = userDoc.data();
    return data?.downloads?.[projectId] || 0;
  } catch (error) {
    console.error('Error getting download count:', error);
    throw error;
  }
}

/**
 * Check if a user has reached their download limit for a project
 * @param {string} userId - The ID of the user
 * @param {string} projectId - The ID of the project
 * @returns {Promise<boolean>} - True if limit is reached, false otherwise
 */
export async function hasReachedDownloadLimit(userId, projectId) {
  try {
    const count = await getDownloadCount(userId, projectId);
    return count >= 3;
  } catch (error) {
    console.error('Error checking download limit:', error);
    throw error;
  }
}

/**
 * Increment download count if limit not reached
 * @param {string} userId - The ID of the user
 * @param {string} projectId - The ID of the project
 * @returns {Promise<boolean>} - True if increment successful, false if limit reached
 */
export async function tryIncrementDownload(userId, projectId) {
  try {
    const count = await getDownloadCount(userId, projectId);
    if (count >= 3) {
      return false;
    }

    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Create new user document with downloads
      await setDoc(userRef, {
        downloads: {
          [projectId]: 1
        }
      });
    } else {
      await updateDownloadCount(userId, projectId);
    }

    return true;
  } catch (error) {
    console.error('Error incrementing download:', error);
    throw error;
  }
}

export { updateDownloadCount, getDownloadCount };
