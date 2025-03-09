/*
  # Add admin user

  1. Create admin user
    - Email: admin@medlab.com
    - Password: Admin@123
    - Role: admin

  2. Security
    - Set user role to admin
*/

-- Create admin user if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@medlab.com'
  ) THEN
    -- Insert admin user
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'admin',
      'admin@medlab.com',
      crypt('Admin@123', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"role":"admin"}',
      now(),
      now(),
      '',
      ''
    );
  END IF;
END $$;