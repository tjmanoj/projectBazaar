import { db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

export const setupAdmin = async (userId) => {
  try {
    // Create admin user document
    await setDoc(doc(db, 'users', userId), {
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log(`User ${userId} has been successfully set as admin!`);
  } catch (error) {
    console.error('Error setting up admin:', error);
    throw error;
  }
};
