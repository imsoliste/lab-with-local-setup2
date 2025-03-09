/*
  # Initial Database Schema

  1. Tables
    - users (extends auth.users)
    - labs (diagnostic centers)
    - tests (medical tests)
    - lab_test_prices (pricing for tests at labs)
    - bookings (test appointments)
    - payments (payment records)
    - test_results (test reports)
    - health_records (user health documents)

  2. Security
    - RLS enabled on all tables
    - Public read access for labs and tests
    - Authenticated user access for own data
    - Admin access for all data

  3. Relationships
    - Foreign key constraints
    - Cascading deletes where appropriate
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
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
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  rating numeric(2,1) DEFAULT 0.0,
  accredited boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE labs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for labs"
  ON labs
  FOR SELECT
  TO public
  USING (true);

-- Tests Table
CREATE TABLE IF NOT EXISTS tests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  category text NOT NULL,
  parameters text[] DEFAULT '{}',
  preparation_instructions text,
  report_time_hours integer DEFAULT 24,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for tests"
  ON tests
  FOR SELECT
  TO public
  USING (true);

-- Lab Test Prices Table
CREATE TABLE IF NOT EXISTS lab_test_prices (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  lab_id uuid NOT NULL REFERENCES labs(id) ON DELETE CASCADE,
  test_id uuid NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  price numeric(10,2) NOT NULL CHECK (price > 0),
  discounted_price numeric(10,2) CHECK (discounted_price > 0),
  home_collection_available boolean DEFAULT true,
  home_collection_fee numeric(10,2) DEFAULT 0 CHECK (home_collection_fee >= 0),
  created_at timestamptz DEFAULT now(),
  UNIQUE(lab_id, test_id)
);

ALTER TABLE lab_test_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for lab test prices"
  ON lab_test_prices
  FOR SELECT
  TO public
  USING (true);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  test_id uuid NOT NULL REFERENCES tests(id),
  lab_id uuid NOT NULL REFERENCES labs(id),
  booking_date date NOT NULL,
  booking_time text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  amount numeric(10,2) NOT NULL CHECK (amount > 0),
  home_collection boolean DEFAULT false,
  address text,
  additional_tests uuid[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can read own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can read all bookings"
  ON bookings
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  amount numeric(10,2) NOT NULL CHECK (amount > 0),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  gateway_payment_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create payments"
  ON payments
  FOR INSERT
  TO authenticated
  WITH CHECK (booking_id IN (
    SELECT id FROM bookings WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can read own payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (booking_id IN (
    SELECT id FROM bookings WHERE user_id = auth.uid()
  ));

CREATE POLICY "Admins can manage all payments"
  ON payments
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Test Results Table
CREATE TABLE IF NOT EXISTS test_results (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  test_id uuid NOT NULL REFERENCES tests(id),
  lab_id uuid NOT NULL REFERENCES labs(id),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  test_date date NOT NULL,
  result_data jsonb NOT NULL,
  report_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own test results"
  ON test_results
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Labs can create test results"
  ON test_results
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'role' = 'lab');

CREATE POLICY "Admins can manage all test results"
  ON test_results
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Health Records Table
CREATE TABLE IF NOT EXISTS health_records (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  record_type text NOT NULL,
  record_date date NOT NULL,
  description text,
  document_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own health records"
  ON health_records
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_test_id ON bookings(test_id);
CREATE INDEX IF NOT EXISTS idx_bookings_lab_id ON bookings(lab_id);
CREATE INDEX IF NOT EXISTS idx_lab_test_prices_lab_id ON lab_test_prices(lab_id);
CREATE INDEX IF NOT EXISTS idx_lab_test_prices_test_id ON lab_test_prices(test_id);
CREATE INDEX IF NOT EXISTS idx_test_results_booking_id ON test_results(booking_id);
CREATE INDEX IF NOT EXISTS idx_test_results_user_id ON test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_health_records_user_id ON health_records(user_id);