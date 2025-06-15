import { db } from '../firebaseConfig';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

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
