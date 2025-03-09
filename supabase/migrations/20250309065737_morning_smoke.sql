/*
  # Create Admin User

  1. Changes
    - Creates initial admin user with phone number
    - Sets role as 'admin'

  2. Security
    - Uses secure UUID for user ID
    - Maintains existing RLS policies
*/

-- Insert admin user if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE phone = '+917339799364'
  ) THEN
    -- First create auth user
    INSERT INTO auth.users (
      id,
      phone,
      role,
      created_at
    ) VALUES (
      gen_random_uuid(),
      '+917339799364',
      'authenticated',
      now()
    );

    -- Then create user profile
    INSERT INTO public.users (
      id,
      phone,
      role,
      name,
      created_at
    ) VALUES (
      (SELECT id FROM auth.users WHERE phone = '+917339799364'),
      '+917339799364',
      'admin',
      'Admin User',
      now()
    );
  END IF;
END $$;