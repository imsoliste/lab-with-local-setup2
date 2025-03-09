/*
  # Add Admin Role and Initial Admin User

  1. Changes
    - Add admin role to auth.users
    - Create initial admin user
    - Add RLS policies for admin access
*/

-- Create admin role
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role = 'admin'
    FROM users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policies to include admin access
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (is_admin() OR auth.uid() = id);

CREATE POLICY "Admins can update all users"
  ON users
  FOR UPDATE
  TO authenticated
  USING (is_admin() OR auth.uid() = id)
  WITH CHECK (is_admin() OR auth.uid() = id);

-- Create initial admin user if not exists
INSERT INTO users (id, phone, role, name, email)
VALUES 
  ('00000000-0000-0000-0000-000000000000', '7339799364', 'admin', 'Admin User', 'admin@medlabcompare.com')
ON CONFLICT (id) DO UPDATE
SET role = 'admin';