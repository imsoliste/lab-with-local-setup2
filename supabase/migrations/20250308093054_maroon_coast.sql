/*
  # Fix RLS and Policies Migration

  1. Purpose
    - Enable RLS on all tables
    - Set up proper access policies
    - Fix duplicate policy issues

  2. Changes
    - Enable RLS on bookings and lab_test_prices tables
    - Create proper policies for data access
    - Add necessary indexes for performance

  3. Security
    - Ensure proper access control
    - Prevent unauthorized access
    - Maintain data privacy
*/

-- Enable RLS on tables
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_test_prices ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to prevent conflicts
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can create bookings" ON bookings;
  DROP POLICY IF EXISTS "Users can read own bookings" ON bookings;
  DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;
  DROP POLICY IF EXISTS "Admins can read all bookings" ON bookings;
  DROP POLICY IF EXISTS "Admins can update all bookings" ON bookings;
  DROP POLICY IF EXISTS "Allow public read access" ON lab_test_prices;
END $$;

-- Create policies for bookings table
CREATE POLICY "Users can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.jwt()->>'role' = 'admin');

CREATE POLICY "Admins can update all bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (auth.jwt()->>'role' = 'admin');

-- Create policy for lab_test_prices table
CREATE POLICY "Allow public read access"
  ON lab_test_prices
  FOR SELECT
  TO public
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS bookings_user_id_idx ON bookings(user_id);
CREATE INDEX IF NOT EXISTS bookings_test_id_idx ON bookings(test_id);
CREATE INDEX IF NOT EXISTS bookings_lab_id_idx ON bookings(lab_id);
CREATE INDEX IF NOT EXISTS lab_test_prices_lab_id_idx ON lab_test_prices(lab_id);
CREATE INDEX IF NOT EXISTS lab_test_prices_test_id_idx ON lab_test_prices(test_id);