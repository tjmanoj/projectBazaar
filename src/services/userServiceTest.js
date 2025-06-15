import { fetchAllUsers } from './userService';

// Test function to verify the updated fetchAllUsers from Firestore
const testFetchAllUsers = async () => {
  try {
    console.log('Testing fetchAllUsers...');
    const users = await fetchAllUsers();
    console.log(`Successfully fetched ${users.length} users from Firestore:`, users);
    return users;
  } catch (error) {
    console.error('Error testing fetchAllUsers:', error);
    throw error;
  }
};

export { testFetchAllUsers };
