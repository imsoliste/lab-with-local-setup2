import { setupDatabase } from './setupDatabase';

export const initializeApp = async () => {
  try {
    // Set up database schema and sample data
    const success = await setupDatabase();
    
    if (!success) {
      console.error('Failed to set up database');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error initializing app:', error);
    return false;
  }
};