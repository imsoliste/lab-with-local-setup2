/*
  # Complete Database Schema Setup

  1. Tables Created:
    - users (for user profiles)
    - labs (for lab information)
    - tests (for test catalog)
    - lab_test_prices (for lab-specific test pricing)
    - bookings (for test bookings)
    - payments (for payment tracking)

  2. Security:
    - RLS enabled on all tables
    - Proper access policies for each table
    - Secure data access patterns

  3. Relationships:
    - Foreign key constraints
    - Proper indexing
*/

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE,
  phone text UNIQUE NOT NULL,
  name text,
  role text DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Labs Table
CREATE TABLE IF NOT EXISTS labs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  rating numeric(2,1) DEFAULT 0.0,
  accredited boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE labs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to labs"
  ON labs
  FOR SELECT
  TO public
  USING (true);

-- Tests Table
CREATE TABLE IF NOT EXISTS tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL,
  parameters text[] DEFAULT '{}',
  preparation_instructions text,
  report_time_hours integer DEFAULT 24,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to tests"
  ON tests
  FOR SELECT
  TO public
  USING (true);

-- Lab Test Prices Table
CREATE TABLE IF NOT EXISTS lab_test_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lab_id uuid REFERENCES labs(id),
  test_id uuid REFERENCES tests(id),
  price numeric(10,2) NOT NULL,
  discounted_price numeric(10,2) NOT NULL,
  home_collection_available boolean DEFAULT true,
  home_collection_fee numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(lab_id, test_id)
);

ALTER TABLE lab_test_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to prices"
  ON lab_test_prices
  FOR SELECT
  TO public
  USING (true);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  test_id uuid REFERENCES tests(id),
  lab_id uuid REFERENCES labs(id),
  booking_date date NOT NULL,
  booking_time text NOT NULL,
  status text DEFAULT 'pending',
  amount numeric(10,2) NOT NULL,
  home_collection boolean DEFAULT false,
  address text,
  additional_tests text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

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

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id),
  amount numeric(10,2) NOT NULL,
  status text DEFAULT 'pending',
  gateway_payment_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (
    booking_id IN (
      SELECT id FROM bookings 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create payments"
  ON payments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    booking_id IN (
      SELECT id FROM bookings 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can read all payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (auth.jwt()->>'role' = 'admin');

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS bookings_user_id_idx ON bookings(user_id);
CREATE INDEX IF NOT EXISTS bookings_test_id_idx ON bookings(test_id);
CREATE INDEX IF NOT EXISTS bookings_lab_id_idx ON bookings(lab_id);
CREATE INDEX IF NOT EXISTS lab_test_prices_lab_id_idx ON lab_test_prices(lab_id);
CREATE INDEX IF NOT EXISTS lab_test_prices_test_id_idx ON lab_test_prices(test_id);
CREATE INDEX IF NOT EXISTS payments_booking_id_idx ON payments(booking_id);

-- Add some sample data for testing
INSERT INTO labs (name, address, city, rating, accredited) VALUES
  ('Dr. Lal PathLabs', 'Malviya Nagar', 'Jaipur', 4.5, true),
  ('Pathkind Labs', 'Tonk Road', 'Jaipur', 4.3, true),
  ('SRL Diagnostics', 'MI Road', 'Jaipur', 4.2, true);

INSERT INTO tests (name, description, category, parameters, preparation_instructions, report_time_hours) VALUES
  ('Complete Blood Count', 'Basic blood test that checks RBC, WBC, platelets', 'Blood Tests', 
   ARRAY['RBC Count', 'WBC Count', 'Platelet Count', 'Hemoglobin'], 
   'Fasting for 8-10 hours recommended', 24),
  ('Thyroid Profile', 'Measures thyroid hormones T3, T4, and TSH', 'Thyroid',
   ARRAY['T3', 'T4', 'TSH'],
   'No special preparation required', 24),
  ('Lipid Profile', 'Measures cholesterol and triglycerides', 'Heart',
   ARRAY['Total Cholesterol', 'HDL', 'LDL', 'Triglycerides'],
   'Fasting for 12 hours required', 24);