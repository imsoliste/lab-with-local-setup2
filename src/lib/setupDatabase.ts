import { supabase } from './supabase';

export const setupDatabase = async () => {
  try {
    // Check if database is already set up by checking if users table exists
    const { data: existingTables, error: checkError } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (!checkError && existingTables) {
      console.log('Database already set up');
      return true;
    }

    console.log('Database not set up, please run the migrations in the Supabase dashboard');
    return false;
  } catch (error) {
    console.error('Error checking database setup:', error);
    return false;
  }
};