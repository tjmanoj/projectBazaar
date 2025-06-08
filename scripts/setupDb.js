import { setupDatabase } from '../src/utils/setupDatabase.js';

// Run the setup
setupDatabase()
  .then(() => {
    console.log('Database setup completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
