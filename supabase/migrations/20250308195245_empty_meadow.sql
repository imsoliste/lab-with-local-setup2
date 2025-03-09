/*
  # Admin Authentication Setup

  1. Changes
    - Add admin role and policies
    - Add admin authentication check functions
    - Update existing tables with admin access

  2. Security
    - Enable RLS on all tables
    - Add admin-specific policies
    - Add user-specific policies
*/

-- Create admin authentication function
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.role() = 'authenticated' AND 
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policies for labs table
ALTER TABLE labs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage labs"
  ON labs
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Public can view labs"
  ON labs
  FOR SELECT
  TO public
  USING (true);

-- Update RLS policies for tests table
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage tests"
  ON tests
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Public can view tests"
  ON tests
  FOR SELECT
  TO public
  USING (true);

-- Update RLS policies for lab_test_prices table
ALTER TABLE lab_test_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage lab_test_prices"
  ON lab_test_prices
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Public can view lab_test_prices"
  ON lab_test_prices
  FOR SELECT
  TO public
  USING (true);

-- Update RLS policies for bookings table
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Users can view own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create admin check trigger
CREATE OR REPLACE FUNCTION check_admin_access()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to sensitive tables
CREATE TRIGGER enforce_admin_labs
  BEFORE INSERT OR UPDATE OR DELETE ON labs
  FOR EACH ROW
  EXECUTE FUNCTION check_admin_access();

CREATE TRIGGER enforce_admin_tests
  BEFORE INSERT OR UPDATE OR DELETE ON tests
  FOR EACH ROW
  EXECUTE FUNCTION check_admin_access();

CREATE TRIGGER enforce_admin_lab_test_prices
  BEFORE INSERT OR UPDATE OR DELETE ON lab_test_prices
  FOR EACH ROW
  EXECUTE FUNCTION check_admin_access();