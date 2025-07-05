import { db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

export const setupAdmin = async (userId) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error setting up admin:', error);
    throw error;
  }
};
