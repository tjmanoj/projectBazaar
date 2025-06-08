import { setupAdmin } from '../src/utils/setupAdmin.js';

// Get userId from command line argument
const userId = process.argv[2];

if (!userId) {
  console.error('Please provide a user ID as an argument');
  console.log('Usage: npm run setup-admin YOUR_USER_ID');
  process.exit(1);
}

// Run the setup
setupAdmin(userId)
  .then(() => {
    console.log('Admin setup completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
