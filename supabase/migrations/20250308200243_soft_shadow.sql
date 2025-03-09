/*
  # Complete Database Schema Setup

  1. New Tables
    - users: User accounts and profiles
    - labs: Laboratory information
    - tests: Available medical tests
    - lab_test_prices: Pricing for tests at different labs
    - bookings: Test booking records
    - payments: Payment transactions
    - offers: Special offers and discounts
    - test_results: Test results and reports

  2. Security
    - Enable RLS on all tables
    - Add admin-specific policies
    - Add user-specific policies
    - Add public access policies

  3. Relationships
    - Foreign key constraints
    - Cascading deletes where appropriate
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
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
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Labs table
CREATE TABLE IF NOT EXISTS labs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  address text NOT NULL,
  city text NOT NULL,
  rating numeric(2,1) DEFAULT 0.0,
  accredited boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE labs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view labs"
  ON labs
  FOR SELECT
  TO public
  USING (true);

-- Tests table
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

CREATE POLICY "Public can view tests"
  ON tests
  FOR SELECT
  TO public
  USING (true);

-- Lab test prices table
CREATE TABLE IF NOT EXISTS lab_test_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lab_id uuid REFERENCES labs(id) ON DELETE CASCADE,
  test_id uuid REFERENCES tests(id) ON DELETE CASCADE,
  price numeric(10,2) NOT NULL,
  discounted_price numeric(10,2),
  home_collection_available boolean DEFAULT true,
  home_collection_fee numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(lab_id, test_id)
);

ALTER TABLE lab_test_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view lab test prices"
  ON lab_test_prices
  FOR SELECT
  TO public
  USING (true);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  test_id uuid REFERENCES tests(id),
  lab_id uuid REFERENCES labs(id),
  booking_date date NOT NULL,
  booking_time text NOT NULL,
  status text DEFAULT 'pending',
  amount numeric(10,2) NOT NULL,
  home_collection boolean DEFAULT false,
  address text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

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

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  amount numeric(10,2) NOT NULL,
  status text DEFAULT 'pending',
  payment_method text,
  transaction_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (
    booking_id IN (
      SELECT id FROM bookings WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create payments"
  ON payments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    booking_id IN (
      SELECT id FROM bookings WHERE user_id = auth.uid()
    )
  );

-- Test results table
CREATE TABLE IF NOT EXISTS test_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  result_data jsonb NOT NULL,
  status text DEFAULT 'pending',
  report_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own test results"
  ON test_results
  FOR SELECT
  TO authenticated
  USING (
    booking_id IN (
      SELECT id FROM bookings WHERE user_id = auth.uid()
    )
  );

-- Offers table
CREATE TABLE IF NOT EXISTS offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  discount_percentage integer NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active offers"
  ON offers
  FOR SELECT
  TO public
  USING (
    active = true AND
    start_date <= CURRENT_DATE AND
    end_date >= CURRENT_DATE
  );

-- Admin function
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

-- Admin policies for all tables
CREATE POLICY "Admins have full access to users"
  ON users
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins have full access to labs"
  ON labs
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins have full access to tests"
  ON tests
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins have full access to lab_test_prices"
  ON lab_test_prices
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins have full access to bookings"
  ON bookings
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins have full access to payments"
  ON payments
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins have full access to test_results"
  ON test_results
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins have full access to offers"
  ON offers
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_labs_city ON labs(city);
CREATE INDEX IF NOT EXISTS idx_tests_category ON tests(category);
CREATE INDEX IF NOT EXISTS idx_lab_test_prices_lab_id ON lab_test_prices(lab_id);
CREATE INDEX IF NOT EXISTS idx_lab_test_prices_test_id ON lab_test_prices(test_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_test_results_booking_id ON test_results(booking_id);
CREATE INDEX IF NOT EXISTS idx_offers_active_dates ON offers(active, start_date, end_date);